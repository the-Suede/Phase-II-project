<?php
    $con = mysqli_connect('localhost','root','123456','muji');

    $id = $_GET['id'];
  
    $sql = "SELECT * FROM `new`";
  
    $res = mysqli_query($con,$sql);

    // print_r($res);
  
    if (!$res) {
      die('error for mysql: ' . mysqli_error());
    }
  

    $row = mysqli_fetch_assoc($res);
    $arr = array();
    while($row){
        array_push($arr,$row);
        $row = mysqli_fetch_assoc($res);
    };


    echo json_encode($arr)
?>