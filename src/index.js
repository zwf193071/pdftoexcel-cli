#!/usr/bin/env node
'use strict'

const chalk = require('chalk')
const fs = require('fs');
const PDFParser = require("pdf2json");
const inquirer = require('inquirer')
const xlsx = require('node-xlsx');
const importJsx = require('import-jsx')

const timesCli = importJsx('./components/times-cli')

console.log(`${chalk.yellow('请按照以下提示输入PDF文件所在的目录和名称：')}`)

async function init() {
    const questions = [
        {
            name: 'dist',
            message: 'PDF文件所在的目录（如C:/Desktop），若不输入则默认为当前目录',
            default: ''
        },
        {
            name: 'name',
            message: 'PDF文件名称',
            validate(value) {
                if (value) {
                    return true
                }
                else {
                    return '值不能为空'
                }
            }
        }
    ];
    const answers = await inquirer.prompt(questions);
    const dist = answers.dist ? `${answers.dist}/` : '';
    const pdfParser = new PDFParser(this, 1);
    pdfParser.loadPDF(`${dist}${answers.name}.pdf`);
    pdfParser.on('pdfParser_dataError', errData => console.error(errData.parserError));

    pdfParser.on('pdfParser_dataReady', () => {
        const data = pdfParser.getRawTextContent();
        inquirer.prompt([
            {
                name: 'words',
                message: '请输入你想检索的名称，若多个请以|分隔',
                validate(value) {
                    if (value) {
                        return true
                    }
                    else {
                        return '检索名称不能为空'
                    }
                }
            }
        ]).then(res => {
            const tbodyArr = res.words.split('|');
            const theadArr = ['检索名称', '出现次数'];
            const list = [];
            const tbodys = [];
            list.push(theadArr);    
            tbodyArr.forEach((a, i) => {
                const reg = new RegExp(a, "g");
                const times = data.match(reg).length;
                list.push([a, times]);
                tbodys.push({
                    nameKey: a + '_' + i,
                    timesKey: times + '_' + i,
                    name: a,
                    times
                })
            });
            timesCli({
                titles: theadArr,
                tbodys
            })
            const buffer = xlsx.build([{ name: 'file', data: list }]); // Returns a buffer
            fs.writeFileSync('list.csv', buffer, 'binary');
        })
    })

}
init()

