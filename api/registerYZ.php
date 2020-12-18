<?php
$username = $_POST['username'];
$con = mysqli_connect('localhost','root','123456','muji');
  
$sql = "SELECT * FROM `user` WHERE `username`='$username'";

$res = mysqli_query($con,$sql);
$row = mysqli_fetch_assoc($res);
if ($row) {
    echo  json_encode(array("data"=>false));
  }else{
    echo  json_encode(array("data"=>true));
  }
?>