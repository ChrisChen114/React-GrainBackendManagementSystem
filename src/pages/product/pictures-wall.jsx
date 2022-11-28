import React from "react";
import {Upload, Icon, Modal, message} from 'antd';
import {reqDeleteImg} from '../../api/index'
import PropTypes from "prop-types";
import {BASE_IMG_URL} from "../../utils/constants";

/*
* 用于图片上传的组件
* */
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends React.Component {
    // 父组件传递过来的字段（属性）
    static propTypes = {
        imgs: PropTypes.array
    }

    state = {
        previewVisible: false, // 标识是否显示大图预览Modal
        previewImage: '', // 大图的URL
        fileList: [
            // {
            //     uid: '-1', // 每个file都有自己唯一的id
            //     name: 'image.png', // 图片文件名
            //     status: 'done', // 图片状态：done-已上传；状态有：uploading，done，error，removed
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 图片地址
            // },
            // {
            //     uid: '-2',
            //     name: 'image.png',
            //     status: 'done',
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            // },
        ],
    };

    constructor(props) {
        super(props);
        let fileList = [];
        //    如果传入了imgs属性
        const {imgs} = this.props;
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: BASE_IMG_URL + img,
            }))
        }

        //    初始化状态
        this.state = {
            previewVisible: false, // 标识是否显示大图预览Modal
            previewImage: '', // 大图的URL
            fileList, // 所有已上传图片的数组
        }
    }

    /*
    * 获取所有已上传图片文件名的数组
    * */
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }

    /*
    * 隐藏Modal
    * */
    handleCancel = () => this.setState({previewVisible: false});

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        // 显示指定file对应的大图
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    /**
     * file: 当前操作的图片文件（上传/删除）
     * fileList: 所有已上传图片文件对象的数组
     */

    handleChange = async ({file, fileList}) => {
        // console.log('handleChange:',file.status,fileList)

        // 一旦上传成功，将当前上传的file的信息修正(name,url)
        if (file.status === 'done') {
            // response也是通过react调试里看到的，
            const result = file.response;// {status:0,data:{name:'xxx.jpg',url:'图片地址'}}
            if (result.status === 0) {
                message.success('上传图片成功');
                const {name, url} = result.data;
                // 取最后一个，也就是刚刚上传的那个
                file = fileList[fileList.length - 1];
                // 默认的名字不一致，而且url还没有，因此才做的下面。可以通过react调试工具发现
                file.name = name;
                file.url = url;
            } else {
                message.error('上传图片失败');
            }
        } else if (file.status === 'removed') {//删除图片
            // 前台点删除的时候，并没有删除服务器上的图片，需要下面的步骤来删除服务器上的图片
            const result = await reqDeleteImg(file.name);
            if (result.status === 0) {
                message.success('删除图片成功！');
            } else {
                message.error('删除图片失败！');
            }
        }

        // 在操作（上传/删除）过程中更新fileList状态
        this.setState({
            fileList
        });
    };

    render() {
        const {previewVisible, previewImage, fileList} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div>Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    action="/manage/img/upload" // 上传图片的接口地址。 会在后台建立一个upload文件夹，后台代码有创建文件夹这一步
                    accept='image/*' // 接收哪些类型的文件；只接收图片格式
                    name='image' // 请求参数名
                    listType="picture-card"  //卡片样式； picture-card：能看到预览效果；如果是text，会呈现超链接列表形式，无法预览
                    fileList={fileList} // 所有已上传图片文件对象的数组
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {/* 页可以不加限制：删除 fileList.length >= 8 ? null :    */}
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}

/*
* 1. 子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件就就可以调用
* 2. 父组件调用子组件的方法：在父组件中通过ref得到子组件标签对象（也就是组件对象），调用其方法
* */
