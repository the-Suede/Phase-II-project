<?php
    $con = mysqli_connect('localhost','root','123456','muji');

    $num = $_GET['num'];
    $s = $_GET['s'];
    $start = ($s-1)*$num;
  
    $sql = "SELECT * FROM `goodslist` LIMIT $start,$num";
  
    $res = mysqli_query($con,$sql);

  
    if (!$res) {
      die('error for mysql: ' . mysqli_error());
    }
  
    $dataArr = array();
    $row = mysqli_fetch_assoc($res);
    
    while($row){
        array_push($dataArr,$row);
        $row = mysqli_fetch_assoc($res);
    };

    $sql2 = "SELECT COUNT(*) `count` FROM `goodslist`";
    $res2 = mysqli_query($con,$sql2);
  
    if (!$res2) {
      die('error for mysql: ' . mysqli_error());
    }
    $row2 = mysqli_fetch_assoc($res2);
    # 得到数据的总数量 
    # 需要把商品数据 和总数量都返回 给前端

    echo json_encode(array(
      "total" => $row2['count'],
      "list" => $dataArr,
      "code" => 1,
      "message" => "获取列表数据成功"
    ))

?>