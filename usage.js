$('.nvb_gptb').nvb_gptb({
	beginShow: false, // 一开始是否要显示navbar
	anchors: [
		$('.dom'),
		{
			name: '行程特色', // 自訂選單名字
			moveto: 0 || '0px' || $DOM, // 自訂點擊後要移動到的位置，如果是DOM物件，就移到該DOM物件的位置
		},
		{
			name: '行程內容',
			moveto: 0 || '0px' || $DOM,
		},
	], // 每个锚点的DOM物件 或 object
	dropOffset: 0 || '0px', // 移動到錨點後的偏移(避免navbar檔到)
	fixedClass: 'fixed', // 當fixed時要加上的classname
	position: {
		start: 0 || '0px', // scroll到什么时候开始fixed
		end: 0 || '0px' || false, // scroll到什么时候结束fixed，必须大于start，如果是false，就代表沒有結束fixed scroll點
		top: 0 || '0px' // 当fixed时的top位置
	}
});