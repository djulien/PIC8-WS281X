#!/usr/bin/env node
//DSL parser for Javascript

"use strict";
require("colors").enabled = true; //for console output; https://github.com/Marak/colors.js/issues/127
//const thru2 = require("through2"); //https://www.npmjs.com/package/through2
//console.error("dsl running ...".green_lt);


/////////////////////////////////////////////////////////////////////////////////
////
/// DSL stream wrapper:
//

const DuplexStream = require("duplex-stream"); //https://github.com/samcday/node-duplex-stream
const thru2 = require("through2"); //https://www.npmjs.com/package/through2
const {/*Readable, Writable,*/ PassThrough} = require("stream");
const {LineStream} = require('byline');
//const RequireFromString = require('require-from-string');
//const CaptureConsole = require("capture-console");
//const toAST = require("to-ast"); //https://github.com/devongovett/to-ast
const REPL = require("repl"); //https://nodejs.org/api/repl.html


const DSL =
module.exports.DSL =
function DSL(opts) //{filename, replacements, prefix, suffix}
{
    if (!opts) opts = {};
//TODO: define custom ops
//    const instrm = new Readable();
//    const outstrm = //new Writable();
//    instrm
//        .pipe(new LineStream({keepEmptyLines: true})) //preserve line#s (for easier debug)
//        .pipe(thru2(xform, flush)); //{ objectMode: true, allowHalfOpen: false },
//        .pipe(outstrm);
//    retval.infile = infile;
//    PreProc.latest = retval;
//    return new DuplexStream(outstrm, instrm); //return endpts; CAUTION: swap in + out
//    instrm.pipe = function(strm) { return outstrm.pipe(strm); };
//    return instrm;
    const instrm = new PassThrough(); //wrapper end-point
//    const instrm = new LineStream({keepEmptyLines: true}); //preserve line#s (for easier debug)
    if (opts.debug)
        for (var a in process.argv)
            console.error(`arg[${a}/${process.argv.length}]: '${process.argv[a]}'`.blue_lt);
    var outstrm = instrm
        .pipe(new LineStream({keepEmptyLines: true})) //preserve line#s (for easier debug and correct #directive handling)
        .pipe(thru2(xform, flush)); //syntax fixups
    if ("run" in opts) //execute logic
    {
        const [replin, replout] = [outstrm, new PassThrough()]; //new end-point
        const repl = REPL.start(
        {
            prompt: "", //don't want prompt
            input: replin, //send output from DSL code to repl
            output: replout, //send repl output to caller
//            eval: "tbd",
//            writer: "tbd",
            replMode: REPL.REPL_MODE_STRICT, //easier debug
            ignoreUndefined: true, //only generate real output
//            useColors: true,
        });
//        repl.defineCommand(kywd, func);
        if (opts.debug) repl
            .on("exit", data => { if (!data) data = ""; console.error(`repl exit: ${typeof data} ${data.toString().length}:${data.toString()}`.cyan_lt); })
        if (opts.debug) replin
            .on("data", data => { if (!data) data = ""; console.error(`repl in len ${data.toString().length}: ${data.toString().replace(/\n/gm, "\\n")}`.blue_lt); })
            .on("end", data => { if (!data) data = ""; console.error(`repl in end: ${typeof data} ${data.toString().length}:${data.toString()}`.cyan_lt); })
            .on("finish", data => { if (!data) data = ""; console.error(`repl in finish: ${typeof data} ${data.toString().length}:${data.toString()}`.cyan_lt); })
            .on("close", data => { if (!data) data = ""; console.error(`repl in close: ${typeof data} ${data.toString().length}:${data.toString()}`.cyan_lt); })
            .on("error", data => { if (!data) data = ""; console.error(`repl in error: ${typeof data} ${data.toString().length}:${data.toString()}`.red_lt); });
//        const module = RequireFromString()[opts.run]();: new PassThrough());
        if (opts.debug) replout
            .on("data", data => { if (!data) data = ""; console.error(`repl out len ${data.toString().length}: ${data.toString().replace(/\n/gm, "\\n")}`.blue_lt); })
            .on("end", data => { if (!data) data = ""; console.error(`repl out end: ${typeof data} ${data.toString().length}:${data.toString()}`.cyan_lt); })
            .on("finish", data => { if (!data) data = ""; console.error(`repl out finish: ${typeof data} ${data.toString().length}:${data.toString()}`.cyan_lt); })
            .on("close", data => { if (!data) data = ""; console.error(`repl out close: ${typeof data} ${data.toString().length}:${data.toString()}`.cyan_lt); })
            .on("error", data => { if (!data) data = ""; console.error(`repl out error: ${typeof data} ${data.toString().length}:${data.toString()}`.red_lt); });
        outstrm = replout;
//        outstrm.on("exit", () => { });
//        console.log(JSON.stringify(toAST(func), null, "  "));
//    recursively walk ast;
//    for each function call, add func to list
//           if (func.toString().match(/main/))
//             console.log(CodeGen(wait_1sec));
    }
    return new DuplexStream(outstrm, instrm); //return endpts for more pipelining; CAUTION: swap in + out

    function xform(chunk, enc, cb)
    {
        prepend.call(this);
        if (isNaN(++this.numlines)) this.numlines = 1;
        if (typeof chunk != "string") chunk = chunk.toString(); //TODO: enc?
//        chunk = chunk.replace(/[{,]\s*([a-z\d]+)\s*:/g, (match, val) => { return match[0] + '"' + val + '":'; }); //JSON fixup: numeric keys need to be quoted :(
//        inject.call(this);
        if (chunk.length)
        {
//            if (!this.buf) this.linenum = this.numlines;
//            this.buf = (this.buf || "") + chunk; //.slice(0, -1);
//console.error(`line ${this.numlines}: last char ${this.buf.slice(-1)}`);
//            if (chunk.slice(-1) == "\\") //line continuation (mainly for macros)
//            {
//                if (chunk.indexOf("//") != -1) warn(`single-line comment on ${this.numlines} interferes with line continuation`);
  //              this.buf = this.buf.slice(0, -1);
//                this.push(chunk.slice(0, -1)); //drop backslash and don't send newline
//                cb();
//                return;
//            }
//            else
            this.linenum = this.numlines;
//            var keep = (opts.replacements || []).every((replace, inx, all) =>
//            {
//                if (chunk.match(/^\s*#\s*!/)) chunk = "//" + chunk; //skip shebang
//            }, this);
//            if (keep)
//            chunk = (opts.preprocess || noshebang)(chunk);
            if (this.linenum == 1) chunk = chunk.replace(/^\s*#\s*!/, "//$&$'"); //skip shebang
            if (opts.preprocess) chunk = opts.preprocess(chunk);
            if (chunk) this.push(chunk + ` //line ${this.linenum}\n`); //add line delimiter
        }
//        if (this.buf) //process or flush
////        {
//            var parts = this.buf.match(/^\s*#\s*([a-z0-9_]+)\s*(.*)\s*$/i);
//            this.buf = parts? macro(parts[1], parts[2], this.linenum): macro(this.buf); //handle directives vs. expand macros
//            if (this.buf) this.push(/-*this.linenum + ": " +*-/ this.buf + "\n");
//            this.buf = null;
//        }
//        this.push(chunk);
        cb();
    }
    function flush(cb)
    {
//        inject.call(this);
//        const now = new Date(); //Date.now();
//        if (this.buf) this.push(this.buf + "\\\n"); //reinstate line continuation char on last partial line
//TODO: why is this.numlines off by 1?
//        this.push(`//eof; lines: ${this.linenum || 0}, warnings: ${warn.count || 0}, errors: ${error.count || 0}, src: ${this.infile}, when: ${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${now.getHours()}:${nn(now.getMinutes())}:${nn(now.getSeconds())}\n`);
//        dump_macros();
//        this.push("console.log(\"end\");");
        append.call(this);
        if (opts.run) this.push(`const ast = require("${process.argv[1]}").walkAST(${opts.run});\n`);
        cb();
    }
    function prepend()
    {
        if (this.numlines) return; //this.prepended) return; //only do once
        this.push(opts.prefix || "console.log(\"code start\");\n");
//        this.prepended = true;
    }
//    function noshebang(str)
//    {
//        return str.replace(/^\s*#\s*!/, "//$&$'"); //skip shebang
//    }
    function append()
    {
        prepend.call(this); //in case not done yet
        this.push(opts.suffix || "console.log(\"code end\");\n");
    }
}


/////////////////////////////////////////////////////////////////////////////////
////
/// Traverse ast:
//

const toAST = require("to-ast"); //https://github.com/devongovett/to-ast
const walkAST =
module.exports.walkAST =
//traverse AST, use main() as root:
//returns array of top-level functions
function walkAST(entpt)
{
    const funclist = [entpt], seen = {}; //start out with main entry point, add dependent functions during traversal (skips unused functions)
//recursively walk ast
//    for each function call, add func to list
//    if (func.toString().match(/main/))
//        console.log(CodeGen(wait_1sec));
    for (var i = 0; i < funclist.length; ++i) //CAUTION: loop size might grow during traversal
    {
//        funclist[i] = traverse(funclist[i]);
        const ast = toAST(funclist[i]); //symbol -> AST
//        expected(funclist[i], ast.type, "FunctionExpression");
//        expected(`${funclist[i]}.id`, ast.id.type, "Identifier");
//        console.log(`/*const ast_${ast.id.name} =*/ ${JSON.stringify(ast, null, "  ")};\n`);
//        if (ast.body.type == "BlockStatement")
//            ast.body.body.forEach(stmt =>
        seen[funclist[i]] = ast;
        console.log(`ast_${funclist[i]} = ${JSON.stringify(ast, null, "  ")}`);
        traverse(funclist[i], ast, "FunctionExpression");
    }
    return funclist.map((item, inx) => { return seen[item]}); //return ASTs to caller, not just symbols

    function traverse(name, ast_node, want_type)
    {
        if (want_type && (ast_node.type != want_type)) throw `AST: expected '${name}' to be ${want_type}, not ${ast_node.type}`.red_lt;
        switch (ast_node.type)
        {
            case "FunctionExpression": //{id, params[], defaults[], body{}, generator, expression}
                if (!want_type) funclist.push(ast_node.id.name);; //add to active function list
                (ast_node.defaults || []).forEach((item, inx, all) => { traverse(`def[${inx}]`, item); });
                traverse(ast_node.id.name, ast_node.body);
                break;
            case "BlockStatement": //{type, body[]}
//                if (!ast_node.body) throw `AST: expected body for ${name}`.red_lt;
                (ast_node.body || []).forEach((item, inx, all) => { traverse(`block[${inx}]`, item); });
                break;
            case "VariableDeclaration": //{type, declarations[], kind}
                (ast_node.declarations || []).forEach((item, inx, all) => { traverse(`decl[${inx}]`, item); });
                break;
            case "VariableDeclarator": //{type, id, init{}}
                traverse(ast_node.id.name, ast_node.init);
                break;
            case "ArrayExpression": //{type, elements[]}
                (ast_node.elements || []).forEach((item, inx, all) => { traverse(`item[${inx}]`, item); });
                break;
            case "ExpressionStatement": //{type, expression{}}
                traverse(name, ast_node.expression);
                break;
            case "CallExpression": //{type, callee{}, arguments[]}
                var callee = (ast_node.callee.type == "MemberExpression")? `${ast_node.callee.object.name}.${ast_node.callee.property.name}`: ast_node.callee.name;
                console.log(`found call to ${callee}: ${JSON.stringify(ast_node.callee)}, already seen? ${!!seen[callee]}`);
                if (!seen[callee]) { funclist.push(callee); seen[callee] = toAST(callee); }
                (ast_node.arguments || []).forEach((item, inx, all) => { traverse(`arg[${inx}]`, item); });
                break;
            case "ArrowFunctionExpression": //{type, id, params[], defaults[], body{}, generator, expression}
                (ast_node.params || []).forEach((item, inx, all) => { traverse(`param[${inx}]`, item); });
                (ast_node.defaults || []).forEach((item, inx, all) => { traverse(`def[${inx}]`, item); });
                traverse(name, ast_node.body);
                break;
            case "BinaryExpression": //{type, operator, left{}, right{}}
                traverse("lhs", ast_node.left);
                traverse("rhs", ast_node.right);
                break;
//ignore leafs:
            case "Identifier": //{type, name}
            case "Literal" : //{type, value, raw}
            case "MemberExpression": //{type, computed, object{}, property{}}
                break;
            default: //for debug
                throw `AST: unhandled node type for ${name}: '${ast_node.type}'`.red_lt;
        }
//        return ast;
    }
//    function expected(name, what, want, is)
//    {
//        if (what != want) throw `AST: expected '${name}' to be a ${want}, not ${is}`.red_lt;
//    }
}


/////////////////////////////////////////////////////////////////////////////////
////
/// Helper functions:
//

const error =
module.exports.error =
function error(msg)
{
    if (isNaN(++error.count)) error.count = 1;
    console.error(("[ERROR] " + msg).red_lt);
}


const warn =
module.exports.warn =
function warn(msg)
{   
    if (isNaN(++warn.count)) warn.count = 1;
    console.error(("[WARNING] " + msg).yellow_lt);
}


//NOTE: hard-coded date/time fmt
const date2str =
module.exports.date2str =
function date2str(when)
{
    if (!when) when = new Date(); //when ||= new Date(); //Date.now();
    return `${when.getMonth() + 1}/${when.getDate()}/${when.getFullYear()} ${when.getHours()}:${nn(when.getMinutes())}:${nn(when.getSeconds())}`;
}


const nn =
module.exports.nn =
function nn(val) { return (val < 10)? "0" + val: val; }


/*
var original = require.extensions['.js']
require.extensions['.js'] = function(module, filename) {
  if (filename !== file) return original(module, filename)
  var content = fs.readFileSync(filename).toString()
  module._compile(stripBOM(content + replCode), filename)
}
*/


/////////////////////////////////////////////////////////////////////////////////
////
/// Unit test/command-line interface:
//

if (!module.parent) //auto-run CLI
{
//    const {LineStream} = require('byline');
    const pathlib = require("path");
    const fs = require("fs");
    const CWD = "";
    const filename = (process.argv.length > 2)? `'${pathlib.relative(CWD, process.argv.slice(-1)[0])}'`: null;
    console.error(`DSL: reading from ${filename || "stdin"} ...`.green_lt);
    const [instrm, outstrm] = [filename? fs.createReadStream(filename.slice(1, -1)): process.stdin, process.stdout]; //fs.createWriteStream("dj.txt")];
    instrm
//        .pipe(prepend())
//        .pipe(new LineStream({keepEmptyLines: true})) //preserve line#s (for easier debug)
//        .pipe(PreProc(infile))
//        .pipe(fixups())
        .pipe(DSL({filename, debug: true, run: "main"}))
//        .pipe(asm_optimize())
//    .pipe(text_cleanup())
//        .pipe(append())
        .pipe(outstrm)
//        .on("data", (data) => { console.error(`data: ${data}`.blue_lt)})
        .on("finish", () => { console.error("finish".green_lt); })
        .on("close", () => { console.error("close".green_lt); })
        .on("done", () => { console.error("done".green_lt); })
        .on("end", () => { console.error("end".green_lt); })
        .on("error", err =>
        {
            console.error(`error: ${err}`.red_lt);
            process.exit();
        });
    console.error("DSL: finish asynchronously".green_lt);
}

//eof