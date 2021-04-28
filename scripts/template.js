/** 
 *  pages 页面快速生成脚本
 *  
 *  npm run tem '文件名‘
*/

const fs = require('fs')
const dirName = process.argv[2]
const capPirName = dirName.substring(0, 1).toUpperCase() + dirName.substring(1);

if (!dirName) {
  console.log('文件名不能为空');
  console.log('用法：npm run tem test');
  process.exit(0);
}

// 页面模板构建

const indexTep = `
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Api from '../../utils/request'
import './${dirName}.scss'
import { BaseProps } from '../../utils/base.interface'
/**
 * ${dirName}.state 参数类型
 *
 * @export
 * @interface ${capPirName}State
 */
export interface ${capPirName}State {}

/**
 * ${dirName}.props 参数类型
 *
 * @export
 * @interface ${capPirName}Props
 */
export interface ${capPirName}Props extends BaseProps{}

@connect(({ ${dirName}, entities,loading }) => ({
    ...${dirName},
    entities: entities,
    loading: loading.models.${dirName}
  }))

class ${capPirName} extends Component<${capPirName}Props,${capPirName}State > {
config:Config = {
    navigationBarTitleText: '页面标题'
}
constructor(props: ${capPirName}Props) {
    super(props)
    this.state = {}
}

componentDidMount() {
    
}

render() {
    return (
    <View className='container'>
        页面内容
    </View>
    )
}
}
export default ${capPirName}
`

// scss 文件模板

const scssTep = `
.container {
    width:100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f4f4f4;
}
`


// 接口请求模板

const serviceTep = `
import Request from '../utils/request';
import { requestConfig } from '../config/requestConfig';

export const getXXX = (data) => {
    return Request.get(requestConfig.getXXX,data);
}
`



// model 模板

const modelTep = `
// import Taro from '@tarojs/taro';
// import * as Api from './service';
export default {
    namespace: '${dirName}',
    state: {
    },
    
    effects: {},
    
    reducers: {}

}

`

fs.mkdirSync(`./src/pages/${dirName}`); // mkdir $1
process.chdir(`./src/pages/${dirName}`); // cd $1

fs.writeFileSync(`${dirName}.tsx`, indexTep); //tsx
fs.writeFileSync(`${dirName}.scss`, scssTep); // scss

// process.chdir(`../../src/models`); // cd $1
// fs.writeFileSync(`${dirName}.ts`, modelTep); // model


// process.chdir(`../../src/services`); // cd $1
// fs.writeFileSync(`${dirName}.ts`, serviceTep); // service

process.exit(0);




