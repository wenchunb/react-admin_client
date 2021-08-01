import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { EditorState, convertToRaw,ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import htmlToDraft from 'html-to-draftjs';


export default class ProductFullEditer extends Component {
    static propTypes = {
        detail:PropTypes.string
    }
    constructor(props) {
        super(props);
        const html = this.props.detail;
        if(html) {
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
              const editorState = EditorState.createWithContent(contentState);
              this.state = {
                editorState,
              };
            }
        }else{
            this.state = {
                editorState: EditorState.createEmpty()
            }
            
        }

      }
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };
//   获取转换成html的文本
getEditorContent = () =>{
      const {editorState} = this.state
      return draftToHtml(convertToRaw(editorState.getCurrentContent()))
  }

  render() {
    const { editorState } = this.state;
    return (
        <Editor
          editorState={editorState}
          editorStyle={{border: "2px solid #000",minHeight: "200px"}}
          onEditorStateChange={this.onEditorStateChange}
        />
    );
  }
}
