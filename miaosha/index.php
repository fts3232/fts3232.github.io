<?php
class miaosha
{
    private $stock = 10;
    private $limit = 2;
    private $stockKey = 'stock';
    private $handle = null;
    private $pdo = null;
    private $productName = null;
    private $userListKey = 'list';

    function __construct($productName)
    {
        try {
            $redis = new Redis();
            $redis->connect('127.0.0.1', 6379);
            $redis->ping();
            $this->handle = $redis;
            $pdo = new PDO('mysql:host=localhost;dbname=laravel', 'root', '');
            $this->pdo = $pdo;
            echo "链接成功";
            $this->productName = $productName;
        } catch (Exception $e) {
            echo '链接失败';
        }
        echo '<br/>';
        if (!empty($_GET['init'])) {
            $this->init();
        }
        echo '当前库存：' . $this->stock;
        echo '<br/>';
        if (empty($_GET['init'])) {
            $this->miaosha();
        }
    }

    function init()
    {
        $sth = $this->pdo->prepare('update stock set stock = :stock where name =:name');
        $sth->bindParam('name', $this->productName);
        $sth->bindParam('stock', $this->stock);
        $sth->execute();
        $sth = $this->pdo->prepare('delete from log');
        $sth->execute();
        $this->setStock();
    }

    function setStock()
    {
        $this->handle->del($this->stockKey);
        $this->handle->del($this->userListKey);
        /*for ($i = 1; $i <= $this->stock; $i++) {
            $this->handle->rPush('good', $i);
        }*/
        $this->handle->hMSet($this->stockKey, array('total' => $this->stock, 'num' => 0));
    }

    function miaosha()
    {
        try {
            $uid = 'uid_' . rand(1, 20);
            $lua = <<<LUA
-- 获取用户购买次数，如果超过限额，提示限额已满
local score = redis.call('zScore', KEYS[2], ARGV[1]);
if(score and tonumber(score) >= tonumber(ARGV[2]))
then
    return {false,'用户:'..ARGV[1]..'已抢过'};
else
    -- 获取当前产品库存和已卖数量
    local rst = redis.call('hMGet', KEYS[1],'num','total');
    -- 如果库存大于已卖数量，允许客户购买，不然提示没货
    if(tonumber(rst[1]) < tonumber(rst[2]))   
    then
        local a = redis.call('zIncrBy',KEYS[2], 1, ARGV[1]);
        local num = redis.call('hIncrBy', KEYS[1], 'num', 1);
        return {true,'用户:'..ARGV[1]..'-当前已抢'..rst[1]};
    else
        return {false,'用户:'..ARGV[1]..'-当前已抢'..rst[1]};
    end
end;
LUA;
            $result = $this->handle->eval($lua, array($this->stockKey, $this->userListKey, $uid,$this->limit), 2);
            var_dump($result);
            $error = $this->handle->getLastError();
            if ($error) {
                throw new Exception('redis错误：' . $error);
            }
            if ($result[0] === false) {
                throw new Exception($result[1] . '-秒杀失败');
            }
            $msg = $result[1] . '-秒杀成功';
            /*if($num === $hash['total']){
                $sth = $this->pdo->prepare('update stock set stock = :stock where name =:name');
                $sth->bindParam('name', $this->productName);
                $sth->bindParam('stock',  0);
                $sth->execute();
            }*/
        } catch (Exception $e) {
            $msg = $e->getMessage();
        }
        $sth = $this->pdo->prepare('insert into log(content) values(:content)');
        $sth->bindParam('content', $msg);
        $sth->execute();
        echo $msg;
        $this->handle->close();
    }
}

new miaosha('产品1');