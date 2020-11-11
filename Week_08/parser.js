/*
 * html三种标签
 * 开始标签
 * 结束标签
 * 自封闭标签
 * 
 */

const css = require("css");
const layout = require("./layout.js");

let currentToken = null;
let currentAttribute = null;
let stack = [{type: 'document', children: []}]
let currentTextNode = null;

let rules = []
function addCssRules(text) {
	let ast = css.parse(text);
	console.log(JSON.stringify(ast))
	rules.push(...ast.stylesheet.rules)
}
/*
.a class选择器
#a id选择器
div tag选择器
 */
function matche(element, selector) {
	if (!selector || !element.attributes)
		return false;
	if (selector.charAt(0) == "#") {// class选择器
		let attr = element.attributes.filter(attr => attr.name === "class")[0];
		if (attr && attr.value === selector.replace("#", ""))
			return true;
	} else if (selector.charAt(0) == ".") {
		let attr = element.attributes.filter(attr => attr.name === "id")[0];
		if (attr && attr.value === selector.replace(".", "")) {
			return true;
		}
	} else {
		if (element.tagName === selector) {
			return true;
		}
	}
	return false;
}

function specificity(selector) {
	let p = [0, 0, 0, 0];
	let selectorParts = selector.split(" ");
	for (const part of selectorParts) {
		if (part.charAt(0) == "#") {
			p[1] += 1;
		} else if (part.charAt(0) == ".") {
			p[2] += 1;
		} else {
			p[3] += 1;
		}
	}
	return p;
}

function compare(sp1, sp2) {
	if(sp1[0] - sp2[0]) {
		return sp1[0] - sp2[0];
	}
	if (sp1[1] - sp2[1])
		return sp1[1] - sp2[1];
	if (sp1[2] - sp2[2])
		return sp1[2] - sp2[2];
	return sp1[3] - sp2[3];
}

function computeCss(element) {
	let elements = stack.slice().reverse()// 从内向外
	// console.log(rules)
	// console.log(elements)
	if(!element.computedStyle)
		element.computedStyle = {};
	
	for (let rule of rules) {
		let selectorParts = rule.selectors[0].split(" ").reverse();
		if (!matche(element, selectorParts[0]))
			continue;
		
		let matched = false;

		let j = 1;
		for (let i = 0; i < elements.length; i++) {
			if (matche(elements[i], selectorParts[j])) {
				j++;
			}
		}
		if (j >= selectorParts.length)
			matched = true;
		if (matched) {
			let sp = specificity(rule.selectors[0])
			let computedStyle = element.computedStyle;
			for (const declaration of rule.declarations) {
				if (!computedStyle[declaration.property])
					computedStyle[declaration.property] = {};
				
				if (!computedStyle[declaration.property].specificity) {
					computedStyle[declaration.property].value = declaration.value;
					computedStyle[declaration.property].specificity = sp;
				} else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
					computedStyle[declaration.property].value = declaration.value;
					computedStyle[declaration.property].specificity = sp;
				}
			}
			console.log(computedStyle);
		}
	}
}

function emit(token) {
	let top = stack[stack.length - 1];
	if (token.type == "startTag") {
		let element = {
			type: "element",
			children: [],
			attributes: []
		};
		element.tagName = token.tagName;
		for(let p in token) {
			if(p != "type" && p != "tagName") {
				element.attributes.push({
					name: p,
					value: token[p]
				});
			}
		}

		computeCss(element)

		top.children.push(element);
		element.parent = top;

		if (!token.isSelfClosing) {
			stack.push(element);
		}
		currentTextNode = null;
	} else if (token.type == "endTag") {
		if (top.tagName != token.tagName) {
			console.log(token);
			throw new Error("tag start end doesn't match");
		} else {
			if (token.tagName == "style") {
				addCssRules(top.children[0].content)
			}
			layout(top);
			stack.pop();
		}
		currentTextNode = null;
	} else if (token.type == "text") {
		if (currentTextNode == null) {
			currentTextNode = {
				type: "text",
				content: ""
			};
			top.children.push(currentTextNode)
		}
		currentTextNode.content += token.content;
	}

}

const EOF = Symbol("EOF")

function data(c) {
	if (c == "<") {
		return tagOpen;
	} else if (c == EOF) {
		emit({
			type: "EOF"
		});
		return;
	} else {
		emit({
			type: "text",
			content: c
		});
		return data;
	}
}

function tagOpen(c) {
	if (c == "/") {
		return endTagOpen;
	} else if (c.match(/^[a-zA-Z]$/)) {
		currentToken = {
			type: 'startTag',
			tagName: ''
		};
		return tagName(c);
	} else {
		return;
	}
}

function endTagOpen(c) {
	if (c.match(/^[a-zA-Z]$/)) {
		currentToken = {
			type: 'endTag',
			tagName: ''
		};
		return tagName(c)
	} else if (c == '>') {

	} else if (c == EOF) {

	} else {

	}
}

function tagName(c) {
	if (c.match(/^[\t\n\f ]$/)) {
		return beforeAtrributeName;
	} else if (c == '/') {
		return selfClosingStartTag;
	} else if (c.match(/^[a-zA-Z]$/)) {
		currentToken.tagName += c;
		return tagName;
	} else if (c == '>') {
		emit(currentToken);
		return data;
	} else {
		return tagName;
	}
}

function beforeAtrributeName(c) {
	if (c.match(/^[\t\n\f ]$/)) {
		return beforeAtrributeName;
	} else if (c == '>') {
		return data;
	} else if (c == '=') {
		return beforeAtrributeName;
	} else {
		currentAttribute = {
			name: "",
			value: ""
		}
		return attributeName(c);
	}
}

function attributeName(c) {
	if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
		return afterAttributName(c);
	} else if (c == "=") {
		return beforeAtrributeValue;
	} else if (c == "\u0000") {

	} else if (c == "\"" || c == "'" || c == "<") {

	} else {
		currentAttribute.name += c;
		return attributeName;
	}
}

function beforeAtrributeValue(c) {
	if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
		return beforeAtrributeValue;
	} else if (c == "\"") {
		return doubleQuotedAttributeValue;
	} else if (c == "\'") {
		return singleQuotedAttributeValue;
	} else if (c == ">") {

	} else {
		return UnquotedAttributeValue(c);
	}
}

function doubleQuotedAttributeValue(c) {
	if (c == "\"") {
		currentToken[currentAttribute.name] = currentAttribute.value;
		return afterQuotedAttributeValue;
	} else if (c == "\u0000") {

	} else if (c == EOF) {

	} else {
		currentAttribute.value += c;
		return doubleQuotedAttributeValue;
	}
}

function singleQuotedAttributeValue(c) {
	if (c == "\'") {
		currentToken[currentAttribute.name] = currentAttribute.value
	} else if (c == "\u0000") {

	} else if (c == EOF) {

	} else {
		currentAttribute.value += c;
		return doubleQuotedAttributeValue;
	}
}

function afterQuotedAttributeValue(c) {
	if (c.match(/^[\t\n\f ]$/)) {
		return beforeAtrributeName;
	} else if (c == "/") {
		return selfClosingStartTag;
	} else if (c == ">") {
		currentToken[currentAttribute.name] = currentAttribute.value;
		emit(currentToken);
		return data;
	} else if (c == EOF) {

	} else {
		currentAttribute.value += c;
		return doubleQuotedAttributeValue;
	}
}

function UnquotedAttributeValue(c) {
	if (c.match(/^[\t\n\f ]$/)) {
		currentToken[currentAttribute.name] = currentAttribute.value;
		return beforeAtrributeName;
	} else if (c == "/") {
		currentToken[currentAttribute.name] = currentAttribute.value;
		return selfClosingStartTag;
	} else if (c == ">") {
		currentToken[currentAttribute.name] = currentAttribute.value;
		emit(currentToken);
		return data;
	} else if (c == "\u0000") {

	} else if (c == "\"" || c == "'" || c == "<" || c == "=" || c == "`") {

	} else if (c == EOF) {

	} else {
		currentAttribute.value += c;
		return UnquotedAttributeValue;
	}
}

function afterAttributName(c) {
	if (c.match(/^[\t\n\f ]$/)) {
		return afterAttributName;
	} else if (c == "/") {
		return selfClosingStartTag;
	} else if (c == "=") {
		currentToken[currentAttribute.name] = currentAttribute.value;
		emit(currentToken);
		return data;
	} else if (c == EOF) {

	} else {
		currentToken[currentAttribute.name] = currentAttribute.value;
		currentAttribute = {
			name: "",
			value: ""
		};
		return attributeName(c)
	}
}

function selfClosingStartTag(c) {
	if (c == ">") {
		currentToken.isSelfClosing = true;
		emit(currentToken)
		return data;
	} else if (c == EOF) {

	} else {

	}
}

module.exports.parseHtml = function parseHtml(html) {
	console.log(html)
	let state = data;
	for (let c of html) {
		state = state(c);
	}
	state = state(EOF);
	return stack[0]
}