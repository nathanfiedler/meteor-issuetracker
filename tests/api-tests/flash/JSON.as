class JSON {
	var ch:String = '';
	var at:Number = 0;
	var t, u;
	var text:String;

	function stringify(arg):String {

		var c, i, l, s = '', v;

		switch (typeof arg) {
			case 'object' :
				if (arg) {
					if (arg instanceof Array) {
						for (i = 0; i < arg.length; ++i) {
							v = stringify(arg[i]);
							if (s) {
								s += ',';
							}
							s += v;
						}
						return '[' + s + ']';
					}
					else if (typeof arg.toString != 'undefined') {
						for (i in arg) {
							v = arg[i];
							if (typeof v != 'undefined' && typeof v != 'function') {
								v = stringify(v);
								if (s) {
									s += ',';
								}
								s += stringify(i) + ':' + v;
							}
						}
						return '{' + s + '}';
					}
				}
				return 'null';
			case 'number' :
				return isFinite(arg) ? String(arg) : 'null';
			case 'string' :
				l = arg.length;
				s = '"';
				for (i = 0; i < l; i += 1) {
					c = arg.charAt(i);
					if (c >= ' ') {
						if (c == '\\' || c == '"') {
							s += '\\';
						}
						s += c;
					}
					else {
						switch (c) {
							case '\b' :
								s += '\\b';
								break;
							case '\f' :
								s += '\\f';
								break;
							case '\n' :
								s += '\\n';
								break;
							case '\r' :
								s += '\\r';
								break;
							case '\t' :
								s += '\\t';
								break;
							default :
								c = c.charCodeAt();
								s += '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
						}
					}
				}
				return s + '"';
			case 'boolean' :
				return String(arg);
			default :
				return 'null';
		}
	}
	function white() {
		while (ch) {
			if (ch <= ' ') {
				this.next();
			}
			else if (ch == '/') {
				switch (this.next()) {
					case '/' :
						while (this.next() && ch != '\n' && ch != '\r') {
						}
						break;
					case '*' :
						this.next();
						for (; ; ) {
							if (ch) {
								if (ch == '*') {
									if (this.next() == '/') {
										next();
										break;
									}
								}
								else {
									this.next();
								}
							}
							else {
								error("Unterminated comment");
							}
						}
						break;
					default :
						this.error("Syntax error");
				}
			}
			else {
				break;
			}
		}
	}

	function error(m) {
		throw {name:'JSONError', message:m, at:at - 1, text:text};
	}
	function next() {
		ch = text.charAt(at);
		at += 1;
		return ch;
	}
	function str() {
		var i, s = '', t, u;
		var outer:Boolean = false;

		if (ch == '"') {
			while (this.next()) {
				if (ch == '"') {
					this.next();
					return s;
				}
				else if (ch == '\\') {
					switch (this.next()) {
						case 'b' :
							s += '\b';
							break;
						case 'f' :
							s += '\f';
							break;
						case 'n' :
							s += '\n';
							break;
						case 'r' :
							s += '\r';
							break;
						case 't' :
							s += '\t';
							break;
						case 'u' :
							u = 0;
							for (i = 0; i < 4; i += 1) {
								t = parseInt(this.next(), 16);
								if (!isFinite(t)) {
									outer = true;
									break;
								}
								u = u * 16 + t;
							}
							if (outer) {
								outer = false;
								break;
							}
							s += String.fromCharCode(u);
							break;
						default :
							s += ch;
					}
				}
				else {
					s += ch;
				}
			}
		}
		this.error("Bad string");
	}

	function arr() {
		var a = [];

		if (ch == '[') {
			this.next();
			this.white();
			if (ch == ']') {
				this.next();
				return a;
			}
			while (ch) {
				a.push(this.value());
				this.white();
				if (ch == ']') {
					this.next();
					return a;
				}
				else if (ch != ',') {
					break;
				}
				this.next();
				this.white();
			}
		}
		this.error("Bad array");
	}

	function obj() {
		var k, o = {};

		if (ch == '{') {
			this.next();
			this.white();
			if (ch == '}') {
				this.next();
				return o;
			}
			while (ch) {
				k = this.str();
				this.white();
				if (ch != ':') {
					break;
				}
				this.next();
				o[k] = this.value();
				this.white();
				if (ch == '}') {
					this.next();
					return o;
				}
				else if (ch != ',') {
					break;
				}
				this.next();
				this.white();
			}
		}
		this.error("Bad object");
	}

	function num() {
		var n = '', v;

		if (ch == '-') {
			n = '-';
			this.next();
		}
		while (ch >= '0' && ch <= '9') {
			n += ch;
			this.next();
		}
		if (ch == '.') {
			n += '.';
			this.next();
			while (ch >= '0' && ch <= '9') {
				n += ch;
				this.next();
			}
		}
		if (ch == 'e' || ch == 'E') {
			n += ch;
			this.next();
			if (ch == '-' || ch == '+') {
				n += ch;
				this.next();
			}
			while (ch >= '0' && ch <= '9') {
				n += ch;
				this.next();
			}
		}
		v = Number(n);
		if (!isFinite(v)) {
			this.error("Bad number");
		}
		return v;
	}

	function word() {
		switch (ch) {
			case 't' :
				if (this.next() == 'r' && this.next() == 'u' && this.next() == 'e') {
					this.next();
					return true;
				}
				break;
			case 'f' :
				if (this.next() == 'a' && this.next() == 'l' && this.next() == 's' && this.next() == 'e') {
					this.next();
					return false;
				}
				break;
			case 'n' :
				if (this.next() == 'u' && this.next() == 'l' && this.next() == 'l') {
					this.next();
					return null;
				}
				break;
		}
		this.error("Syntax error");
	}

	function value() {
		this.white();
		switch (ch) {
			case '{' :
				return this.obj();
			case '[' :
				return this.arr();
			case '"' :
				return this.str();
			case '-' :
				return this.num();
			default :
				return ch >= '0' && ch <= '9' ? this.num() : this.word();
		}
	}
	function parse(_text:String):Object {
		text = _text;
		at = 0;
		ch = ' ';
		return value();
	}
}