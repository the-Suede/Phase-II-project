<?php
    # 用户名 商品id
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    $con = mysqli_connect('localhost','root','123456','muji');


    $sql = "INSERT INTO `user` (`id`, `username`, `password`) VALUES (null, '$username', '$password')";
    $res = mysqli_query($con,$sql);

    if($res){
        echo json_encode(array("code"=>true,"msg"=>"注册成功"));
    }else{
        echo json_encode(array("code"=>false,"msg"=>"注册失败"));
    }

?>