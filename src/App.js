import React from "react";
import {
  Stage,
  Layer,
  Transformer,
  Image,
  Container,
  Rect,
  Group,
} from "react-konva";
//import Konva from "konva";

let history = [];
let historyStep = 0;
export let myImage = new window.Image();
const urlImg = require("./download.png");
myImage.src = urlImg;
class App extends React.Component {
  constructor(props) {
    super(props);
    this.stage = React.createRef();
  }
  state = {
    toTransform: false,
    position: {},
    render: false,
    imgRatio: 1,
    imgQ: 1,
  };
  componentDidMount() {
    const _ = this;
    myImage.onload = () => {
      _.setState({ render: true });
    };
  }
  undo = () => {
    console.log("json", this.stage.current.toJSON());
    this.stage.current.find("#layer1")[0].toImage({
      callback(img) {
        if (img.src) {
          const byteCharacters = window.atob(img.src.split(",")[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/jpeg" });

          window.open(URL.createObjectURL(blob));
          console.log("ca ka img", URL.createObjectURL(blob));
        }
      },
      mimeType: "image/jpeg",
      quality: parseFloat(this.state.imgQ),
      pixelRatio: parseFloat(this.state.imgRatio),
    });
  };

  dragHandler = (e) => {
    console.log("onDrag", e.target);
  };
  render() {
    const { toTransform } = this.state;
    const newHeight = (700 / myImage.width) * myImage.height;
    const newWidth = 700;

    return (
      this.state.render && (
        <div
          className="App"
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <Stage
            ref={this.stage}
            width={700}
            height={window.innerHeight - 100}
            onWheel={(e) => {
              e.evt.preventDefault();
              const img = this.stage.current.find("#imgRef")[0];
              var oldScale = img.scaleX();
              var pointer = this.stage.current.getPointerPosition();
              var scaleBy = 1.4;
              var mousePointTo = {
                x: (pointer.x - img.x()) / oldScale,
                y: (pointer.y - img.y()) / oldScale,
              };
              var newScale =
                e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
              img.scale({ x: newScale, y: newScale });
              var newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
              };
              img.position(newPos);
              this.stage.current.batchDraw();
              // console.log("img", img);
              // if (e.evt.deltaY < 0) {
              //   img.scale({
              //     x: img.scale().x + 0.1,
              //     y: img.scale().y + 0.1,
              //   });
              //   this.setState({ scaled: true });
              // } else {
              //   img.scale({
              //     x: img.scale().x - 0.1,
              //     y: img.scale().y - 0.1,
              //   });
              //   this.setState({ scaled: true });
              // }
            }}
          >
            <Layer>
              <Rect
                fill="#ccc"
                x={0}
                y={0}
                width={700}
                height={window.innerHeight - 100}
              ></Rect>
            </Layer>
            <Layer
              id="layer1"
              onDblClick={() => {
                alert("image editor");
              }}
            >
              <Group
                clip={{
                  x: 0,
                  y: 0,
                  width: 700,
                  height: window.innerHeight - 100,
                }}
              >
                <Image
                  height={newHeight}
                  width={newWidth}
                  onClick={() => {
                    this.setState({ toTransform: !toTransform });
                  }}
                  id="imgRef"
                  image={myImage}
                  onDragEnd={(e) => {
                    console.log(
                      "ca ka drag end",
                      " josn:",
                      JSON.parse(e.target.toJSON())["attrs"]
                    );
                  }}
                  draggable
                  centeredScaling={true}
                />
                {toTransform && (
                  <Transformer
                    anchorStroke={"red"}
                    anchorFill={"white"}
                    anchorSize={10}
                    borderDash={[10, 10]}
                    nodes={[this.stage.current.find("#imgRef")[0]]}
                    keepRatio={true}
                    enabledAnchors={[
                      "top-left",
                      "top-right",
                      "bottom-left",
                      "bottom-right",
                    ]}
                    rotationSnaps={[0, 90, 180, 270]}
                    centeredScaling={true}
                  />
                )}
              </Group>
            </Layer>
          </Stage>
          <input
            type={"text"}
            onChange={(e) => {
              this.setState({ imgQ: e.target.value });
            }}
          />
          <input
            type={"text"}
            onChange={(e) => {
              this.setState({ imgRatio: e.target.value });
            }}
          />
          <button onClick={this.undo}>
            Export Quality : {this.state.imgQ} , Export Ratio :{" "}
            {this.state.imgRatio}{" "}
          </button>
        </div>
      )
    );
  }
}

export default App;
