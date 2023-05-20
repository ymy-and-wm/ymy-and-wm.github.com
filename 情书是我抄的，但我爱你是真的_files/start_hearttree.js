

//以下是树的js____________________________________________
$('#div_start_bg').height(window_height);
var bool_jump=true;
var hearttree_desc=start_content['hearttree_desc']; //显示计时器上的事件

//时间点是必须要选择的，事件和计时方式可以不写
var bool_timer=false;
var hearttree_time=start_content['hearttree_time'];
if(typeof(hearttree_time)!='undefined' && hearttree_time!=''){ //时间点是必须要选择的
    bool_timer=true;
}
if(start_content['bool_save']==false || typeof(hearttree_time)=='undefined'){
    hearttree_time='2022-08-16';
    bool_timer=true; //全空作品如果预览hearttree应该显示计时
}

var hearttree_time_type=start_content['hearttree_time_type'];
if(typeof(hearttree_time_type)=='undefined' || hearttree_time_type==''){
    hearttree_time_type='hearttree_postive';
}



function init_hearttree(){
    console.log('init_hearttree'); 
    var canvas_tree = $('#canvas_tree');  
    if (!canvas_tree[0].getContext) { //如果不支持画布，则提示错误
        $('#div_tree_error').show();
        $('#div_hearttree').remove(); //整体删除
        init_theme(); //直接显示主题
        return; 
    }

    var width = canvas_tree.width();
    var height = canvas_tree.height();
    // canvas_tree.attr('width', width);
    // canvas_tree.attr('height', height);

    var opts = {
        seed: {
            // x: width / 2 - 20, //画布宽度的一半减去20
            // y: height / 2 - 20, //画布高度的一半减去20
            color: 'rgb(190, 26, 37)',
            scale: 2
        },
        //第1层是1个，第2层是9个，第3层是5个，第4层都是9个或8个
        //其实以下只是不同层级的树干，结构一样为
        //point1为[0,1], point2为[2,3], point3为[4,5], radius为[6], length为[7], branchs为下一层级
        branch: [
            [235, 815, 270, 385, 200, 335, 30, 100, [
                [240, 615, 155, 502, 80, 510, 13, 100, [ //左下的树干
                    [180, 550, 154, 525, 144, 510, 2, 40] //左下树干的树枝
                ]],
                [250, 580, 300, 491, 380, 480, 12, 100, [ //右下树干
                    [278, 535, 348, 544, 361, 561, 3, 80] //右下树干的树枝
                ]],
                [235, 416, 237, 383, 234, 352, 3, 40], //中间的小树干
                [246, 532, 113, 382, 48, 379, 9, 80, [ //左上的树干
                    [134, 421, 93, 388, 81, 338, 2, 40], //左上树干的上树枝
                    [198, 480, 135, 450, 95, 465, 4, 60] //左上树干的下树枝
                ]],
                [246, 492, 308, 387, 378, 356, 6, 100, [ //右上的树干
                    [290, 428, 346, 412, 348, 406, 2, 80] //右上树干的树枝
                ]]
            ]] 
        ],
        bloom: {
            num: 700,
            width: 500,
            height: 880,
        },
        footer: {
            width: 500,
            height: 40,
            speed: 5,
        }
    }

    var tree = new Tree(canvas_tree[0], width, height, opts); //实例化tree对象
    var seed = tree.seed;
    var foot = tree.footer;
    var hold = 1;

    $('#div_tree_start').click(function(e){
        var offset = canvas_tree.offset(); //默认都是0 
        var x; 
        var y;
        x = e.pageX - offset.left;
        y = e.pageY - offset.top;
        // console.log('offset.left->'+offset.left+'  offset.top->'+offset.top);
        // console.log('e.pageX->'+e.pageX+'  e.pageX->'+e.pageY);
        // console.log('x->'+x+'  y->'+y); 
        hold = 0; //关键的一步作为触发
        canvas_tree.unbind('click'); 
        canvas_tree.unbind('mousemove');
        canvas_tree.removeClass('hand'); 
        $('#div_tree_start').remove(); 
    });

    var seedAnimate = eval(Jscex.compile('async', function () { 
        seed.draw(); //这里就完成了初始化的界面了，显示一个心形
        while (hold) { //如果为0就执行
            $await(Jscex.Async.sleep(10));
        } 
        while (seed.canScale()) { //seed.canScale()从一开始就是true
            seed.scale(0.95);
            $await(Jscex.Async.sleep(10));
        }
        while (seed.canMove()) {
            seed.move(0, 2);
            foot.draw();
            $await(Jscex.Async.sleep(10));
        }
    }));

    var growAnimate = eval(Jscex.compile('async', function () {
        do {
            tree.grow();
            $await(Jscex.Async.sleep(10));
        } while (tree.canGrow());
    }));

    var flowAnimate = eval(Jscex.compile('async', function () {
        do {
            tree.flower(2);
            $await(Jscex.Async.sleep(10));
        } while (tree.canFlower());
    }));

    var moveAnimate = eval(Jscex.compile('async', function () {
        tree.snapshot('p1', 0, 0, 610, 815); //function(k, x, y, width, height)
        while (tree.move('p1', 130, 0)) {
            foot.draw();
            $await(Jscex.Async.sleep(10));
        }
        foot.draw();
        tree.snapshot('p2', 130, 0, 610, 815);

        // 会有闪烁不得意这样做, (＞﹏＜)
        canvas_tree.parent().css('background', 'url(' + tree.toDataURL('image/png') + ')');
        // canvas_tree.css('background', '#ffe');
        $await(Jscex.Async.sleep(300));
        canvas_tree.css('background', 'none');
    }));

    var jumpAnimate = eval(Jscex.compile('async', function () {
        var ctx = tree.ctx;
        while (bool_jump) {
            tree.ctx.clearRect(0, 0, width, height);
            tree.jump();
            // foot.draw();
            $await(Jscex.Async.sleep(25));
        }
    }));

    var textAnimate = eval(Jscex.compile('async', function () {
        $('#div_tree_text').show();
        hearttree_typed();
        
        if(bool_timer){
            $('#div_tree_timer #span_tree_desc').html(hearttree_desc);
            if(typeof(hearttree_desc)=='undefined' || hearttree_desc==''){ //处理全空作品
                $('#div_tree_timer #span_tree_desc').html('我们已经在一起');
            }
            $('#div_tree_timer').fadeIn();
        }

        if(bool_timer){
            while (bool_jump) {
                hearttree_timer(hearttree_time,hearttree_time_type);
                $await(Jscex.Async.sleep(1000));
            }
        }else{
            while (bool_jump) {
                $await(Jscex.Async.sleep(1000));
            }
        } 
    }));

    var runAsync = eval(Jscex.compile('async', function () {
        $await(seedAnimate());
        $await(growAnimate());
        $await(flowAnimate());
        $await(moveAnimate());
        textAnimate().start();
        $await(jumpAnimate());
    }));
    runAsync().start();
}



function hearttree_typed(){
    console.log('hearttree_typed');
    if(bool_empty(start_content,'hearttree_text')==true){
        var str_start='谢命运，让你我相遇<br>于千万人之中，在时光的荒野里<br>不早也不晚，刚刚好<br>好想对你说，很高兴遇见你';
    }else{
        var str_start=start_content['hearttree_text'];
    }
    
    var hearttree_typed=new Typed('#span_tree_typed', {
        strings: [str_start], //输入内容, 支持html标签
        typeSpeed: 150, //打字速度
        cursorChar: '❤',//替换光标的样式
        contentType: 'html', //值为html时，直接解析html标签
        onComplete: function(abc){
                    // console.log(abc);
                    console.log('finished typing hearttree words');
                    setTimeout(function(){
                        bool_jump=false;  
                        $('#div_hearttree').fadeOut(); 
                    },3000); 
                    setTimeout(function(){ 
                        $('#div_hearttree').remove();
                        init_theme(); 
                    },3500); 
                },
    });
}



function hearttree_timer(date_dest,type){
    var date_current=Date().replace(/-/g,'/');
    // console.log(date_current);
    date_dest_safe=new Date(date_dest.replace(/-/g,'/'));
    // console.log(date_dest_safe);
    if(type=='hearttree_postive'){ //正计时还是倒计时，  +' GMT +8'是设置北京时间东八区
        var seconds=(Date.parse(date_current)-Date.parse(date_dest_safe))/1000;
    }else{
        var seconds=(Date.parse(date_dest_safe)-Date.parse(date_current))/1000;
    }
    var days=Math.floor(seconds/(3600*24));
    seconds=seconds%(3600*24);
    var hours=Math.floor(seconds/3600);
    if(hours<10){
        hours='0'+hours;
    }
    seconds=seconds%3600;
    var minutes= Math.floor(seconds/60);
    if(minutes<10){
        minutes='0'+minutes;
    }
    seconds=seconds%60;
    if(seconds<10){
        seconds='0'+seconds;
    }
    var result=days+'天 '+hours+ '小时 '+minutes+'分钟 '+seconds+'秒'; 
    $('#div_tree_dhis').html(result);
}




