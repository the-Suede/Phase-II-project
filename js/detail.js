//获取id
let reg = /id=(\d+)/;
if(!reg.test(location.search)){
    location.href = '../html/list.html'
}
let id = reg.exec(location.search)[1];
//根据id获取数据
$.ajax({
    url:'../api/getDetail.php',
    type:'get',
    data:{id:id},
    async: false,
    success: function (res) {
        res=JSON.parse(res);
        // console.log(res);
        
        //渲染图片
        let imageD = JSON.parse(res.detail.imageD);
        renderImg(imageD);
        //渲染文本
        renderText(res);
        //渲染产品参数
        renderProps(res);      
    }
})
//
//放大镜
// new Enlarge(".swiper-wrapper");

//判断是否点击过加入购物车
let flag = false
//事件委托
$('#goods').on('click','.return,.cartBtn,.section-link,.mu-button,.cart_btn,.buy_btn',function(){
    //点击返回键返回list
    if($(this).hasClass('return')){
        location.href = '../html/list.html'
    }
    //
    //点击购物车
    if($(this).hasClass('cartBtn')){
        localStorage.setItem('url',
        'http://47.112.240.136/html/detail.html?id='+id)    
        //判断有没有登录
        let log = getCookie("login");
        if(!log){//如果没有登录
            //保留购物车地址到本地缓存，登录成功后直接跳转
            localStorage.setItem('url',
                        '../html/cart.html')
            //弹出登录框登录
            login()
            return
        }
        location.href = '../html/cart.html'
    }
    //
    //点击产品参数
    if($(this).hasClass('section-link')){
        //渲染产品参数
        //...............
        
        //产品参数框出现
        $('.parameters').fadeIn(100,'linear')
        
    }
    //点击确认框消失
    if($(this).hasClass('mu-button')){
        $('.parameters').fadeOut(100,'linear')
    }
    //
    //点击加入购物车
    if($(this).hasClass('cart_btn')){
        localStorage.setItem('url',
        'http://47.112.240.136/html/detail.html?id='+id)
        //判断是否有登录
        let log = getCookie("login");
        if(!log){//如果没有登录
            //保留购物车地址到本地缓存，登录成功后直接跳转
            
            //弹出登录框登录
            login()
            return
        }
        //传递用户名和商品id，添加购物车数据
       $.ajax({
           url:'../api/addCartData.php',
           type:'get',
           data:{
               username:log,//传递用户名
               goods_id:id//传递商品id
           },
           success:function(res){
               res=JSON.parse(res)
               //提示添加购物车成功               
                alert(res.msg)
                //点击过购物车
                flag = true
           }
       })
    }
    //
    //点击立即购买
    if($(this).hasClass('buy_btn')){
        //判断是否有登录
        let log = getCookie("login");
        if(!log){//如果没有登录
            //保留购物车地址到本地缓存，登录成功后直接跳转
            localStorage.setItem('url',
            'http://47.112.240.136/html/detail.html?id='+id)
            //弹出登录框登录
            login()
            return
        }
        if(flag==true){//如果已经点击过加入购物车了
            location.href = '../html/cart.html' 
            //直接跳转购物车页面
        }else{
            //否者插入购物车数据再跳转购物车
            //传递用户名和商品id，添加购物车数据
        $.ajax({
            url:'../api/addCartData.php',
            type:'get',
            data:{
                username:log,//传递用户名
                goods_id:id//传递商品id
            },
            success:function(res){
                res=JSON.parse(res)
                //提示添加购物车成功               
                //  alert(res.msg)
            }
            
        })
        flag =false
        localStorage.setItem('url',
            'http://47.112.240.136/html/detail.html?id='+id)
        //添加成功后，跳转购物车页面
        location.href = '../html/cart.html'        
        }
        
    }
})

//渲染图片函数
function renderImg(data){
    let str = ''
    // console.log(data);
    // let index = 1
    for(let key in data){
        str+=`<div class="swiper-slide swiper-slide-active" role="group" 
        style="width: 1051px;">
        <div class="swiper-zoom-container">
            <img src="${data[key].image_id}"
                style="width: 414px;height: 414px;">
        </div>
    </div>`
    }
    $('.swiper-wrapper').html(str)
}
//渲染文本函数
function renderText(data){
    let str = ''
    str = `<div class="commodity-meta-wrap">
    <div class="title">
    ${data.detail.name}
    </div>
    <div class="price">
        <span class="price_tag">
            ¥${data.detail.price}
        </span>
    </div>
</div>
<div class="section section-brief">
                    <p>商品编号：
                        <span class="UserSelectArea">
                        ${data.detail.goods_bn}
                        </span>
                    </p>

                </div>
                <div class="section section-normal">
                    <p class="section-link">
                        产品参数
                    </p>
                </div>
    `
    $('.commodity-text-wrap').html(str)
}
//渲染产品参数函数
 function renderProps(data){
    let str = ''
    str = `
    <div class="line">
                    <div class="line-label">商品名称</div>
                    <div class="line-value">${data.detail.name}</div>
                </div>
    `
    let props = JSON.parse(data.detail.props)
    for(let key in props){
        str+=`<div class="line">
        <div class="line-label">${props[key].name}</div>
        <div class="line-value">${props[key].value}</div>
    </div>`
    }
    $('.content').html(str)
}



//封装登陆函数
function login(){
    //登录框出现
    $(".login").finish().css('display','block').animate({bottom:0},500,'linear')//login显示
    //点击X
    $('.cancel').click(function(){
        $(".login").animate({bottom:-705},500,'linear',function(){
            $(".login").css('display','none')
        })
    })
    //点击用户注册跳转页面
    $(".register").click(function(e){
        e.preventDefault()
        location.href='../html/register.html'
    })
}