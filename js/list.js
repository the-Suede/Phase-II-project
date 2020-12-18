//判断是否有cookie，有则显示头像，没有显示登录/注册
let cookie = getCookie('login');
if(cookie){
    $(".userhead").css('display','block');
    $(".loginBtn").css('display','none');
}
//
//鼠标悬停在下载的时候显示下载二维码
$('.download').on('mouseover',function(){
    $('.popup_code').css('visibility','visible')
    $(this).on('mouseout',function(){
        $('.popup_code').css('visibility','hidden')
    })  
})
//
//鼠标悬停在下载的时候显示退出登录
$('.userhead').on('mouseover',function(){
    $('.popup_user').css('visibility','visible')
    $(this).on('mouseout',function(){
        $('.popup_user').css('visibility','hidden')
    })
    //点击退出
    $('.logout').on('click',function(){
        delCookie('login')
    })
})
//
//封装登陆函数
function login(){
    //禁止浏览器滚动
    let top = $(document).scrollTop();
    $(document).on('scroll.unable',function () {
        $(document).scrollTop(top);
    })
    //登录框出现
    $(".login").css('display','block').finish().animate({bottom:0},500,'linear',function(){
        
    })//login显示
    //点击X
    $('.cancel').click(function(){
        $(".login").finish().animate({bottom:-705},500,'linear',function(){
            $(".login").css('display','none')
        })
        //浏览器恢复滚动
        $(document).unbind("scroll.unable");
    })
    //点击用户注册跳转页面
    $(".register").click(function(e){
        e.preventDefault()
        location.href='../html/register.html'
    })
}

//点击登录/注册
$('.loginBtn').click(function(event){
    event.preventDefault()//阻止默认事件
    login()
})

// new获取数据和渲染
$.ajax({
    url: '../api/list-new.php',
    type: 'get',
    async: true,
    success: function (res) {
        res=JSON.parse(res);
        renderNew(res);      
    },
    error: function (err) {
        console.log(err);
    }
})

let page = document.querySelector('.page')
//设置全局变量，让封装的Pagination可以操作
let defaultInfo = {
    num: 15, //一页渲染多少条数据
    s: 1 //默认从第一页开始
}
//goodslist获取数据和渲染
$.ajax({
    url: '../api/goodslist.php',
    data:{
        num:defaultInfo.num,
        s:defaultInfo.s
    },
    type: 'get',
    async: false,
    success: function (res) {
        res=JSON.parse(res);
        
        
        //分页
        new Pagination(page,{
            pageInfo:{
                pagenum :1,
                pagesizez:defaultInfo.num,
                total:res.total,
                totalpage:Math.ceil(res.total / defaultInfo.num)  
            },
            textInfo:{
                first: '首页',
                prev: '上一页',
                next: '下一页',
                last: '最后一页'
            },
            change:function(s){
               defaultInfo.s = s;
               goodsListRender();
               scrollTo(0,0)
            }
        });
    },
    error: function (err) {
        console.log(err);
    }
})
//获取goodslist获取数据并渲染的函数
async function goodsListRender(){
    $.ajax({
        url:'../api/goodslist.php',
        async:false,
        data:{
            num:defaultInfo.num,
            s:defaultInfo.s
        },
        success:function(res){
            res = JSON.parse(res)
            rendergood(res.list)
        }
        
    })
}

//渲染new函数
function renderNew(data){
    let str = '';
    data.forEach(item => {
        str+=` <div class="new_item good" goods_id="${item.goods_id}">
        <div class="item_img">
            <img src="${item.iurl}"
                alt="" style="width: 110px;height: 110px;">
        </div>
        <div class="title">
        ${item.name}
        </div>
        <div class="price">
            <span class="priceTag">
                ¥${item.price}
            </span>
        </div>
    </div>
        `
    });
    $('.content_wrap').html(str)
}

//渲染goodslist函数
function rendergood(dataGood){
    let str = '';
    dataGood.forEach(item => {
        str +=` <li>
        <div class="item good" goods_id="${item.goods_id}">
            <div class="image"
                style="background-image: url(${item.image});background-size: 100%;">
            </div>
            <!---->
            <div class="title">
            ${item.name}
            </div>
            <!---->
            <div class="price">
                <span class="MuPriceTag">
                    ¥ ${item.price}
                </span>
            </div>
        </div>
    </li>
        `
    });
    $('.MuCommodityList ul').html(str)
}

var num =1
//点击事件委托
$('#app').on('click','.cart,.good,.new_left,.new_right',function(e){
    e.preventDefault()

    //点击new左
    if($(this).hasClass('new_right')){
        let distance =num*115
        if(num>=3){
            return
        }
        $('.content_wrap').animate({left:-distance},500,'linear',function(){
            num++     
        })
    }
    //点击new右
    if($(this).hasClass('new_left')){
        
        $('.content_wrap').animate({left:0},1000,'linear',function(){
            num=1
        })
    }
    //当点击购物车的时候
    if($(this).hasClass('cart')){
        //判断有没有登录
        let log = getCookie("login");
        if(!log){//如果没有登录
            //保留购物车地址到本地缓存，登录成功后直接跳转
            localStorage.setItem('url',
                        '../html/cart.html')

            //弹出登录框登录
            /* login-------------------------- */
            //禁止浏览器滚动
            let top = $(document).scrollTop();
            $(document).on('scroll.unable',function () {
                $(document).scrollTop(top);
            })
            //登录框出现
            $(".login").css('display','block').finish().animate({bottom:0},500,'linear',function(){
                
            })//login显示
            //点击X
            $('.cancel').click(function(){
                localStorage.removeItem('url')
                $(".login").finish().animate({bottom:-705},500,'linear',function(){
                    $(".login").css('display','none')
                })
                //浏览器恢复滚动
                $(document).unbind("scroll.unable");
            })
            //点击用户注册跳转页面
            $(".register").click(function(e){
                e.preventDefault()
                location.href='../html/register.html'
            })
            /* login-------------------------- */
            return
        }
        location.href = '../html/cart.html'
    }
    //
    //当点击商品的时候
    if($(this).hasClass('good')){
        let id = $(this).attr('goods_id')
        location.href = "../html/detail.html?id="+id
    }
})

