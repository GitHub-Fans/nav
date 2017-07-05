/**
 * Created by gaowy on 2017/5/8.
 */

;(function($){
    'use strict'
    var ModuleName = 'nvb_gptb';
    var Module =function (ele,options)
    {
        this.elem= $(ele);
        this.df = document.createDocumentFragment();
        this.opts = options;

    };
    Module.DEFAULTS={
        flag:false,
        anchors: [

            {
                name: '行程特色', // 自訂選單名字
                moveto: 200 , // 自訂點擊後要移動到的位置，如果是DOM物件，就移到該DOM物件的位置
            },
            {
                name: '行程內容',
                moveto: 500 ,
            },
            {
                name: '行程备注',
                moveto: 800,
            },
            {
                name: '自费活动',
                moveto: 1100 ,
            },
            {
                name: '活动备注',
                moveto: 1400 ,
            },
            {
                name: '安全守则',
                moveto: 1700,
            },
            {
                name: '脱队规定',
                moveto: 2000 ,
            },
            {
                name: '旅游资讯',
                moveto: 2300
            }
        ],
        dropOffset:0,
        position: {
            start: 200 , // scroll到什么时候开始fixed
            end: false, // scroll到什么时候结束fixed，必须大于start，如果是false，就代表沒有結束fixed scroll點
            top: 0  // 当fixed时的top位置
        },
        time:13,//运动时间
        whenFixed:function(){console.log('whenFixed')},
        whenUnFixed:function(){$('.nvb_gptb').addClass('d-no');console.log('whenUnFixed')}
    };
    //设置是否调用callback开关
    Module.prototype.init=function(){
      this.opts.flag=$(this.elem).hasClass('d-no');
    }
    //利用参数中anchors的moveto来计算要滚动的距离
    function scrollTop(obj)
    {
        var top;
        //如果是object则说明是dom元素
        if($.type(obj)=='object')
        {
            top=$(obj).offset().top
        }
        else{
            top=parseInt(obj)
        }
        top=top=='null'|| top=='undefined'|| isNaN(top)?$(document).scrollTop():top;

        return top;
    }
    //创建导航栏
    Module.prototype.createEle=function(){
        //清空容器
        this.elem.html('');
        var anchors=this.opts.anchors;
        var div=$("<div class='nav-container'><ul class='li-list'></ul></div>");
        for(var i= 0;i<anchors.length;i++)
        {
            var a=$('<a href="javascript:void(0)"></a>').html(anchors[i].name);
            var li=$('<li></li>').append(a).data('moveto',anchors[i].moveto);
            $(div).find('.li-list').append(li);
        }
        $(this.elem).append(div);
    };
    //添加点击跳转到锚点
    Module.prototype.bindClick=function(){

        var that=this;

        var lis=this.elem.find('.li-list li')
        lis.each(function(i,e){
            $(e).on('click',function(e){
                e.preventDefault();
                e.stopPropagation();
                var proxy=this;
                var moveto=scrollTop($(this).data('moveto'));
                $('html,body').stop().animate({scrollTop:moveto-that.opts.dropOffset},that.opts.time,function(){
                    $(proxy).addClass('active').siblings().removeClass('active');
                })
            })
        })

    };
    //添加document滚动事件
    Module.prototype.scroll=function(){
        var that=this;
        var position=this.opts.position;
        var lis=this.elem.find('.li-list li')
        $(window).on('scroll',function(e){
           e.preventDefault();
            var scrolltop=$(document).scrollTop();
            ////导航栏添加红色标记
            for (var i = 0; i<lis.length; i++) {
                var item=lis.eq(i)
                var moveto=scrollTop(item.data('moveto'))-that.opts.dropOffset;
                if (scrolltop >= moveto) {
                    lis.removeClass('active');
                    item.addClass('active');
                }
            }
            //end为false，导航栏永久显示
            if(position.end==false)
            {
                if(scrolltop>=position.start)
                {
                    $(that.elem).find('.nav-container').css({position:'fixed',top:position.top,left:0,display:'block'})
                    if(that.opts.flag)
                    {
                        that.opts.whenFixed();
                        that.opts.flag=!that.opts.flag;
                    }
                }
                else{
                    $(that.elem).find('.li-list li').removeClass('active')
                    $(that.elem).find('.nav-container').removeAttr('style')
                    if(!that.opts.flag)
                    {
                        that.opts.whenUnFixed();
                        that.opts.flag=!that.opts.flag;
                    }

                }

            }
            else{//导航栏在范围内显示
                if(scrolltop>=position.start && scrolltop <= position.end)
                {

                    $(that.elem).find('.nav-container').css({position:'fixed',top:position.top,left:0,display:'block'})
                    if(that.opts.flag)
                    {
                        that.opts.whenFixed();
                        that.opts.flag=!that.opts.flag;
                    }
                }
                //else if(scrolltop > position.end){
                //    $(that.elem).find('.nav-container').removeAttr('style')
                //    if(!that.opts.flag)
                //    {
                //        that.opts.whenUnFixed();
                //        that.opts.flag=!that.opts.flag;
                //    }
                //}
                else{
                    $(that.elem).find('.li-list li').removeClass('active')
                    $(that.elem).find('.nav-container').removeAttr('style')
                    if(!that.opts.flag)
                    {
                        that.opts.whenUnFixed();
                        that.opts.flag=!that.opts.flag;
                    }
                }
            }

        });

    };

    $.fn[ModuleName]=function(options, options2)
    {
        return this.each(function(){
            var $this = $(this);
            var module = $this.data( ModuleName );
            var opts = null;
            if ( !!module ) {
                if ( typeof options === 'string' &&  typeof options2 === 'undefined' ) {
                    module[options]();
                } else if ( typeof options === 'string' &&  typeof options2 === 'object' ) {
                    module[options](options2);
                } else {
                    console.log('unsupported options!');
                    throw 'unsupported options!';
                }
            } else {
                opts = $.extend( {}, Module.DEFAULTS, ( typeof options === 'object' && options ), ( typeof options2 === 'object' && options2 ) );
                module = new Module(this, opts);
                module.init();
                module.createEle();
                module.bindClick();
                module.scroll();
                $this.data( ModuleName, module );
            }
        })
    }

})(jQuery)


