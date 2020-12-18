//获取用户名
let log = getCookie('login')

//获取用户购物车的数据
$.ajax({
    url:'../api/getCartData.php',
    type:'get',
    data:{
        username:log
    },
    success:function(res){
        
        res = JSON.parse(res)
        console.log(res);

        //把整合数据存到本地*******有数据库才有本地
        localStorage.setItem('goodsList',JSON.stringify(res));
        // console.log(res);
        
        render(res);//利用php用goods_id整合的数据渲染页面
    }
})
//渲染函数
function render(data){
    //如果购物车一条数据都没有
    if(!data.length){
        let strNone = ` 
        <div class="cart_title">
            <p class="return"><img src="../images/fanhui.png" alt=""></p>
            <h3>购物车</h3>
            <p class="cart_edit">编辑</p>
        </div>
        <div class="cart_content">
        <div class="nothing">
            购物车是空的
        </div>
        </div>
        <div class="cart_footer">
            <div class="cart_actions">
                <p>
                    <input type="checkbox">
                    <label for="">全选</label>
                    <span class="actions_quantity">0</span>
                    <span>件商品</span>
                </p>
                <p>
                    <span>合计</span>
                    <span class="actions_price">¥0.00</span>
                </p>
            </div>
            <button>
                去结算
            </button>
        </div>
    `
        $('#cart').html(strNone)
        return
    }
    //
    //渲染之前，观察全选按钮 返回布尔值
    let allchecked = data.every(item=>{
        return item.is_select ==1;
    });
    //
    //计算总数函数
    let total = shopNum(data);
    //
    //渲染购物车
    let str = `<div class="cart_title">
    <p class="return"><img src="../images/fanhui.png" alt=""></p>
    <h3>购物车</h3>
    <p class="cart_edit">编辑</p>
    </div>
    <div class="cart_content">`
    
    data.forEach(item=>{
        str+=`
        <div class="cart_item">
                <div class="checkbox_warp">
                    <input type="checkbox" class="check" goods_id="${item.goods_id}" ${item.is_select==1? 'checked' :''}>
                </div>
                <div class="item_img">
                    <a href="#">
                        <img class="media-object" src="${item.image}"
                            alt="">
                    </a>
                </div>
                <div class="text_wrap">
                    <h5>${item.name}</h5>
                    <div class="text_bottom_wrap">
                        <span class="price">¥${item.price}</span>
                        <div class="btn-group" id="num_btn" role="group" aria-label="..." goods_id="${item.goods_id}">
                            <button class="btn btn-default">-</button>
                            <button class="btn btn-default">${item.cart_number}</button>
                            <button class="btn btn-default">+</button>
                        </div>
                    </div>
                </div>
                <div class="delete" goods_id="${item.goods_id}">
                    删除
                </div>
            </div>`
    })
    str+=`</div>
    <div class="cart_footer">
        <div class="cart_actions">
            <p>
                <input type="checkbox" class="checkAll" ${allchecked?'checked':''}>
                <label for="">全选</label>
                <span class="actions_quantity">${total.totalNum}</span>
                <span>件商品</span>
            </p>
            <p>
                <span>合计</span>
                <span class="actions_price">¥${total.totalPrice}</span>
            </p>
        </div>
        <button class="clearCart">
            去结算
        </button>
    </div>`
    $('#cart').html(str)
}

$('#cart').on('click','.return,.cart_edit,.delete,.check,.checkAll,.btn-default,.clearCart',function(){
    //点击返回
    if($(this).hasClass('return')){
        let url = localStorage.getItem('url');
            if(url){
                location.href = url;
                // 登录成功的时候把url的这个cookie值清除
                localStorage.removeItem('url');
            }else{
                location.href = '../html/list.html';
            }     
    }
    //
    //点击编辑
    if($(this).hasClass('cart_edit')){
        //先判断，如果有finish
        if($(this).hasClass('finish')){
            $('.delete').animate({width:0},100,'linear')//有的话，点击让它关上
            $(this).text('编辑').toggleClass('finish')//文字变回编辑，去除finish
            
        }else{//没有finish
            $('.delete').animate({width:70},100,'linear')
            $(this).text('完成').toggleClass('finish')
        }        
    }
    //
    //点击删除
    if($(this).hasClass('delete')){
        // console.log(this);
        console.log($(this).attr('goods_id'));
        let id = $(this).attr('goods_id')
        //删除cartl里面对应id的商品
        $.ajax({
            url:'../api/removeCartData.php',
            type:'get',
            data:{
                username:log,
                goods_id:id
            },
            success:function(res){
                res = JSON.parse(res)
                if(res.code){//操作数据成功
                    let dataLocal = JSON.parse(localStorage.getItem('goodsList'));
                    
                    let re = dataLocal.filter(item=>{
                        return item.goods_id !=id;//本地数据过滤得到不删除的商品
                    });
                    localStorage.setItem('goodsList', JSON.stringify(re));//把过滤得到的数据存回本地
                    render(re);//重新渲染
                }
            }
        })
    }
    //
    //点击单选
    if($(this).hasClass('check')){
        //改变它的is_select(本地数据)
        let id = $(this).attr('goods_id')
        //先获取本地数据
        let dataLocal = JSON.parse(localStorage.getItem('goodsList'));
        //循环本地数据找到选上的那个商品
        dataLocal.forEach(item=>{
            if(item.goods_id == id){
                //如果点击个复选框是选中状态，那么is_select赋值为1                
                item.is_select = this.checked ? 1:0
            }
        })
        localStorage.setItem('goodsList', JSON.stringify(dataLocal));//把过滤得到的数据存回本地
        render(dataLocal);//重新渲染(这里要渲染的原因是：全选框的判断)
    }
    //
    //点击全选
    if($(this).hasClass('checkAll')){
        //循环本地数据，全部is_select=1
        let dataLocal = JSON.parse(localStorage.getItem('goodsList'));
        dataLocal.forEach(item=>{
            //判断有没有选上
            this.checked? item.is_select =1 :item.is_select=0;
        })
        localStorage.setItem('goodsList',JSON.stringify(dataLocal));//存
        render(dataLocal);//渲
    }
    //
    //点击+-
    if($(this).hasClass('btn-default')){
        // console.log(this);
        //传递商品id和+/-
        // count($(this).text)
        let symbols = $(this).text();
        let id =$(this).parent().attr('goods_id')
        count(id,symbols)        
    }
    //
    //点击去结算
    if($(this).hasClass('clearCart')){
        let sure = confirm("确定下单吗？")        
        if(!sure){
            return
        }
        //获取本地数据
        let dataLocal = JSON.parse(localStorage.getItem('goodsList'));
        //循环得到选上的商品
        let buygoods = dataLocal.filter(item=>{
            //判断有没有选上
            return item.is_select ==1
        })
        //循环没选上的商品，一会要渲染
        let notbuygoods = dataLocal.filter(item=>{
            //判断有没有选上
            return item.is_select ==0
        })
        // console.log(buygoods);//数据
        let payTotalPrice=0
        buygoods.forEach(item=>{
            payTotalPrice += item.price*item.cart_number*1
            $.ajax({
            url:'../api/payCartData.php',
            data:{
                username:log,
                goods_id:item.goods_id
            },
            async: false,
            success:function(res){
                res = JSON.parse(res)
                if(res.code){

                    render(notbuygoods);//重新渲染
                   
                }
            }
        })
        })
        alert(`微信转账${payTotalPrice}元`)
        localStorage.setItem('goodsList', JSON.stringify(notbuygoods));

        //清除用户的数据库
        // $.ajax({
        //     url:'../api/clearCart.php',
        //     data:{
        //         username:log,
        //     },
        //     success:function(res){
        //         res = JSON.parse(res)
        //         if(res.code){
        //             localStorage.removeItem('goodsList');
        //             alert("微信转账300块")
        //             render(res.result)
        //         }
        //     }
        // })
    }
})

//count+-函数
function count(id,symbols){
    //先拿数据
    let dataLocal = JSON.parse(localStorage.getItem('goodsList'));
    //过滤得到点击的那条数据
    let newData = dataLocal.filter(item=>{
        return item.goods_id == id
    })[0];
    //改变本地cart_number
    let num = newData.cart_number *1;
    switch (symbols){
        case "+" :
            num++
            break;
        case "-":
            if(num<=1){
                num = 1
            }else{
                num--
            }
    }
    //更新数据库
    $.ajax({
        url:'../api/updCartData.php',
        data:{
            username:log,
            goods_id:id,
            cart_number:num
        },
        success:function(res){
            res=JSON.parse(res)
            if(res.code){
                //为什么filter出来的newData可以改变dataLocal 
                newData.cart_number=num;
                localStorage.setItem('goodsList', JSON.stringify(dataLocal));
                console.log(dataLocal);
                render(dataLocal);//???????????????????????????
            }
        }
    })
}

//shopNum函数
function shopNum(Allgoods){
    //选上的
    let res = Allgoods.filter(item=>{
        return item.is_select == 1
    })
    let totalNum = res.reduce((pre,item)=>{
        return pre+item.cart_number*1
    },0)
    let totalPrice = res.reduce((pre,item)=>{
        return pre+item.price*item.cart_number*1
    },0)
    return{
        totalNum,totalPrice
    }
}