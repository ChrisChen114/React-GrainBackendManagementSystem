import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {EditorState, convertToRaw, ContentState} from 'draft-js'
import {Editor} from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

/*
* 用来指定商品详情的富文本编辑器组件
* react-draft-wysiwyg：wysiwyg - what you see is what you get
* */

class RichTextEditor extends Component {
    static propTypes = {
        detail: PropTypes.string
    }

    state = {
        editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象
    }

    constructor(props) {
        super(props);
        const html = this.props.detail;
        if (html) {//有值,根据html格式祖父穿创建一个
            const contentBlock = htmlToDraft(html);
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.state = {
                editorState,
            };
        } else {
            this.state = {
                editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象
            }
        }
    }

    /*
    * 输入过程中实时的回调
    * */
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    // 返回输入数据对应的html格式的文本
    getDetail = () => {
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/manage/img/upload');
                const data = new FormData();
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    const url = response.data.url//得到图片的url
                    // resolve(url); //这样传不对，百度搜索  https://segmentfault.com/q/1010000012475113/   看回答区域
                    resolve({
                        data: {
                            link: url
                        }
                    })
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    }

    render() {
        const {editorState} = this.state;
        return (
            <Editor
                editorState={editorState}
                editorStyle={{border: '1px solid black', minHeight: 200, paddingLeft: 10}}
                onEditorStateChange={this.onEditorStateChange}// 绑定监听
                toolbar={{
                    image: {uploadCallback: this.uploadImageCallBack, alt: {present: true, mandatory: true}},
                }}
            />
        );
    }
}

/*
        <textarea
        disabled
        value={JSON.stringify(contentState, null, 4)}
        />
 */

export default RichTextEditor;