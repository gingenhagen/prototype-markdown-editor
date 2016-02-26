'use strict';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import ContentEditable from './react-contenteditable';

const normalizeHTML = function normalizeHTML(html) {
  let lines = html.split('\n');
  let lastIndex = lines.length - 1;
  return lines.map((currentValue, index) => {
    if (index === lastIndex && index !== 0 && currentValue === '') {
      return '';
    } else if (currentValue === '') {
      return "<div class='line'><br/></div>";
    } else {
      return `<div class='line'>${currentValue}</div>`;
    }
  }).join('');
};

// class Line extends Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     debugger;
//     return (
//       <div className='line'>
//         {this.props.text}
//       </div>
//     );
//   }
// }

// http://stackoverflow.com/a/4812022
const getCaretOffsetWithin = function getCaretOffsetWithin(element) {
  let sel = document.getSelection();
  if (sel.rangeCount > 0) {
    let range = document.getSelection().getRangeAt(0);
    let preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);

    let offsetString = preCaretRange.toString();

    let textWithNewLines = element.innerText;

    console.assert(textWithNewLines.replace(/\n/g, '').startsWith(offsetString), `"${textWithNewLines.replace(/\n/g, '')}" does not start with "${offsetString}"`);

    let textArray = textWithNewLines.split('\n');
    let [line, column] = textArray.reduce((previousValue, currentValue, currentIndex, array) => {
      if (Array.isArray(previousValue)) {
        return previousValue;
      }

      if (previousValue === currentValue) {
        return [currentIndex, previousValue.length];
      } else if (previousValue.startsWith(currentValue)) {
        return previousValue.substring(currentValue.length);
      } else if (currentValue.startsWith(previousValue)) {
        return [currentIndex, previousValue.length];
      } else {
        throw `Cannot match string "${previousValue}" to line "${currentValue}"`;
      }
    }, offsetString);

    return [line, column];
  }
  return [0, 0];
};

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // lines: [''],
      html: normalizeHTML(''),
      caretLine: 0,
      caretColumn: 0
    };
  }

  handleChange(event) {
    // console.log(`///${event.currentTarget.innerText}///`);

    // // whenever we change, the caret should be a single spot instead of a range
    // // but maybe not guaranteed...

    // // we take a look at the range.endContainer and range.endOffset
    // let range = document.getSelection().getRangeAt(0);
    // let container = range.endContainer;
    // let offset = range.endOffset;

    // // we then figure out what div we should be in

    // debugger;
    let [line, column] = [undefined, undefined];
    if ($(event.currentTarget).parents().has(this.refs.content.htmlEl)) {
      [line, column] = getCaretOffsetWithin(this.refs.content.htmlEl);
    }

    this.setState({
      html: normalizeHTML(event.currentTarget.innerText),
      caretLine: line,
      caretColumn: column
    });

    // let lines = event.currentTarget.innerText
    //   .split('\n')
    //   .filter((element, index, array) => {
    //     return !(element === '' && index > 0 && index === array.length - 1);
    //   });

    // this.setState({ lines: lines });
  }

  componentDidMount() {
    //debugger;
    // $(document).on('selectionchange', function() {
    //   console.log('selectionchange: ');
    //   console.log(arguments);
    // });
  }

  componentDidUpdate(prevProps, prevState) {
    // let selection = document.getSelection();
    // let node = selection.focusNode;
    // let selectionInContent = $(node).closest('.content').length > 0;
    // if (selectionInContent) {
    //   // check to see if we got lost from the top level
    //   if (node === this.refs.content) {

    //   }
    // }
    if (this.state.caretLine !== undefined && this.state.caretColumn !== undefined) {
      // debugger;
      // need to get the div that represents the line, which then has a single child that is a text node
      let lineElement = $(this.refs.content.htmlEl).children().get(this.state.caretLine).childNodes[0];

      let range = document.createRange();
      range.setEnd(lineElement, this.state.caretColumn);
      range.collapse();
      let sel = document.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  render() {
    return <ContentEditable
              ref="content"
              html={this.state.html} // innerHTML of the editable div
              disabled={false}       // use true to disable edition
              onChange={event => this.handleChange(event)} // handle innerHTML change
              className='content'
           />
  }
}


class App extends Component {
  // componentDidMount() {
  //   $(document).on('selectionchange', function() {
  //     console.log('selectionchange: ');
  //     console.log(arguments);
  //   });
  //   $(document).on('selectstart', function() {
  //     console.log('selectstart: ');
  //     console.log(arguments);
  //   });
  // }

  render() {
    return (
      <div>
        <h4>Start editing!</h4>
        <Content />
      </div>
    );
  }
}

export default App;