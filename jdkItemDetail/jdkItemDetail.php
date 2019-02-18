<?php
include "../utils/requestUtils.php" ;
include "../constants/constants.php";

function doGetShopDetail(){
    $data = array (
    'skuid' => $_GET["skuid"],
	);
    $header = array("User-Agent: zst-android-broswer", "sec:".MakeSign($data));
    echo doGet(JDK_SHOP_DETAIL, $data,$header);
}

function doPostCharages(){
    $data = array (
    'feeNum' => $_POST["feeNum"],
    'phone' => $_POST["phone"],
    'userName' => $_POST["userName"],
    );
    $header = array("User-Agent: zst-android-broswer", "sec:".MakeSign($data));
    echo doPost(JDK_CHANGE, $data,$header);
}

function doGetShortChain(){
    $data = array (
    'skuid' => $_GET["skuid"],
    'couponUrl' => $_GET["couponUrl"],
    'positionId' => $_GET["positionId"],
	);
    $header = array("User-Agent: zst-android-broswer", "sec:".MakeSign($data));
    echo doGet(JDK_SHORT_CHAIN, $data,$header);
}

$action = $_REQUEST["act"];
if($action == "doGetShopDetail"){
    doGetShopDetail();
}elseif($action == "doPostCharages"){
	doPostCharages();
}elseif($action == "doGetShortChain"){
 	doGetShortChain();
}

?>



