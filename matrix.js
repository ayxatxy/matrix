(function($){
	const defaultCallback = {
		onClick(event,mSelector){},
		onDblClick(event, mSelector){},
		onMouseEnter(event, mSelector){
			let curColObj = $(event.target);
			$(event.target).css('background-color', 'gray');
			resetBgColorsNotCurCol(mSelector, getColumnID(curColObj));
		},
		onMouseLeave(event, mSelector){
			let curColObj = $(event.target);
			curColObj.css('', $.matrix.getMatrixObj(mSelector).columnBgColor[getColumnID(curColObj)]);
		},
		afterDataRender(element, xId, yId, mText){}
	}
	
	const defaultConfig = {
		style: {
			row: {
				height: 50,
				margin: 0,
				padding: 0
			},
			column: {
				width: 140,
				height: 50,
				margin: 0,
				border: '1px solid gray',
				float: 'left'
			},
			head: {
				backgroundColor: 'black',
				color: 'white',
				fontWeight: 'bold'
			},
			fontSize: 12.5,
			textAlign: 'center'
		},
		head: {
			showHead: false,
			formatter(colObj, text, row, col){
				return text;
			},
			topHead: [],
			rightHead: [],
			bottomHead: [],
			leftHead: [],
			cornerTag: {
				showCornerTag: true,
				formatter(mSelector, config, headIndex){
					return parseInt(headIndex)+1;
				}
			}
		},
		image: {
			contentImg: {
				isShow: false,
				images: [],
				formatter(images, row, col){
					
				}
			}
		},
		callback: defaultCallback
	}
	
	let initMatrix = function(mSelector, config, mData){
		//1.合并默认配置对象和用户自定义对象：todo 后期考虑编写通用深拷贝方法
		let curConfig = mergeConfig(config, defaultConfig);
		//2.创建matrixObject对象，以mSelector为key，存入Matrix对象中
		let matrixObj = new MatrixObject(curConfig, mData);
		$.matrix.matrixObjects[mSelector] = matrixObj;
		//3.渲染矩阵
		renderMatrix(mSelector, curConfig, mData);
	}
	
	function getMatrixObj(mSelector){
		return $.matrix.matrixObjects(mSelector);
	}
	
	function Matrix(){}
	Matrix.prototype = {
		config: defaultConfig,
		init: initMatrix,
		matrixObjects: [],
		getMatrixObj,
		getColumnId,
	}
	
	$.matrix = new Matrix();
	
	MatrixObject.prototype = {
		config: {},
		data: [[]],
		columnBgColor: {}
	}
	function MatrixObject(config, data){
		this.config = config;
		this.data = data;
	}
	
	function resetBgColorsNotCurCol(mSelector, curColID){
		$(`${mSelector} .col.data`).each((index, element)=>{
			let jqEle = $(element);
			let colID = getColumnID(jqEle);
			if(colID != curColID){
				jqEle.css('background-colo', $.matrix.getMatrixObj(mSelector).columnBgColor[colID]);
			}
		});
	}
	
	function getColumnID(columnObj){
		let xId = columnObj.attr('xId');
		let yId = columnObj.attr('yId');
		return `${xId}@${yId}`;
	}
	
	function mergeConfig(config, defaultConfig){
		let curConfig = {
			style: {},
			head: {},
			image: {contentImg: {}},
			callback: {}
		};
		if(config.style){
			curConfig.style.row = {...defaultConfig.style.row, ...config.style.row};
			curConfig.style.column = {...defaultConfig.style.column, ...config.style.column};
			curConfig.style.head = {...defaultConfig.style.head, ...config.style.head};
			curConfig.style.fontSize = config.style.fontSize?
				config.style.fontSize:defaultConfig.style.fontSize;
			curConfig.style.textAlign = config.style.textAlign?
				config.style.textAlign:defaultConfig.style.textAlign;
		} else {
			curConfig.style.row = {...defaultConfig.style.row};
			curConfig.style.column = {...defaultConfig.style.column};
			curConfig.style.head = {...defaultConfig.style.head};
			curConfig.style.fontSize = defaultConfig.style.fontSize;
			curConfig.style.textAlign = defaultConfig.style.textAlign;
		}
		if(config.head){
			curConfig.head.showHead = config.head.showHead?
				config.head.showHead:defaultConfig.head.showHead;
			curConfig.head.formatter = config.head.formatter?
				config.head.formatter:defaultConfig.head.formatter;
			curConfig.head.cornerTag = {...defaultConfig.head.cornerTag, ...config.head.cornerTag};
			curConfig.head.topHead = [...defaultConfig.head.topHead, ...config.head.topHead];
			curConfig.head.rightHead = [...defaultConfig.head.rightHead, ...config.head.rightHead];
			curConfig.head.bottomHead = [...defaultConfig.head.bottomHead, ...config.head.bottomHead];
			curConfig.head.leftHead = [...defaultConfig.head.leftHead, ...config.head.leftHead];
		} else {
			curConfig.head.showHead = defaultConfig.head.showHead;
			curConfig.head.formatter = defaultConfig.head.formatter;
			curConfig.head.cornerTag = {...defaultConfig.head.cornerTag};
			curConfig.head.topHead = [...defaultConfig.head.topHead];
			curConfig.head.rightHead = [...defaultConfig.head.rightHead];
			curConfig.head.bottomHead = [...defaultConfig.head.bottomHead];
			curConfig.head.leftHead = [...defaultConfig.head.leftHead];
		}
		if(config.image && config.image.contentImg){
			curConfig.image.contentImg.isShow = config.image.contentImg.isShow?
				config.image.contentImg.isShow:defaultConfig.image.contentImg.isShow;
			curConfig.image.contentImg.images = [...defaultConfig.image.contentImg.images, ...config.image.contentImg.images];
			curConfig.image.contentImg.formatter = config.image.contentImg.formatter?
				config.image.contentImg.formatter:defaultConfig.image.contentImg.formatter;
				
		} else {
			curConfig.image.contentImg.isShow = defaultConfig.image.contentImg.isShow;
			curConfig.image.contentImg.images = [...defaultConfig.image.contentImg.images];
			curConfig.image.contentImg.formatter = defaultConfig.image.contentImg.formatter;
		}
		curConfig.callback = [...defaultConfig.callback, ...config.callback];
		return curConfig;
	}
})