<style>
    .draggable {
      -webkit-touch-callout:none;
      -ms-touch-action:none; touch-action:none;
      -moz-user-select:none; -webkit-user-select:none; -ms-user-select:none; user-select:none;
    }
  
    .SelectionFrame {
      display:block; position:absolute;
      border:dotted 1px black;
      cursor:move;
    }
  
    .ResizeHandle {
      display:block; position:absolute;
      width:8px; height:8px;
      border:solid 1px black;
      background:dodgerblue;
    }
  
    .ResizeHandle:global(.ui-draggable-helper) {
      visibility:hidden
    }
  </style>
  
  <script>
    import { draggable } from 'svelte-agnostic-draggable'
  
  /**** map all touch events to mouse events ****/
  
    import mapTouchToMouseFor from 'svelte-touch-to-mouse'
    mapTouchToMouseFor('.draggable')
  
  /**** Frame and Handle positions ****/
  
    let FrameX = 150, FrameY = 180, FrameW = 100, FrameH = 40
    const minFrameW = 40, maxFrameW = 300
    const minFrameH = 20, maxFrameH = 300
  
    const HandleW = 8, HandleH = 8
  
    function HandleX (Direction, FrameX, FrameW) {   // extra arg.s for reactivity
      switch (Direction) {
        case 'nw': case 'w': case 'sw': return FrameX - HandleW
        case 'n':  case 's':            return FrameX + Math.round((FrameW-HandleW)/2)
        case 'ne': case 'e': case 'se': return FrameX + FrameW
      }
    }
  
    function HandleY (Direction, FrameY, FrameH) {   // extra arg.s for reactivity
      switch (Direction) {
        case 'nw': case 'n': case 'ne': return FrameY - HandleH
        case 'e':  case 'w':            return FrameY + Math.round((FrameH-HandleH)/2)
        case 'sw': case 's': case 'se': return FrameY + FrameH
      }
    }
  
  /**** Svelte Event Handling ****/
  
    function onFrameDragMove (Event) {
      FrameX = Event.detail.position.left
      FrameY = Event.detail.position.top
    }
  
    function onHandleDragMove (Direction) {
      return (Event) => {
        let HandleX = Event.detail.position.left
        let HandleY = Event.detail.position.top
  
        let FrameR = FrameX + FrameW
        switch (Direction) {
          case 'nw': case 'w': case 'sw': HandleX = Math.max(FrameR-maxFrameW, Math.min(FrameR-minFrameW,HandleX)); break
          case 'ne': case 'e': case 'se': HandleX = Math.max(FrameX+minFrameW, Math.min(FrameX+maxFrameW,HandleX))
        }
        
        let FrameB = FrameY + FrameH
        switch (Direction) {
          case 'nw': case 'n': case 'ne': HandleY = Math.max(FrameB-maxFrameH, Math.min(FrameB-minFrameH,HandleY)); break
          case 'sw': case 's': case 'se': HandleY = Math.max(FrameY+minFrameH, Math.min(FrameY+maxFrameH,HandleY))
        }
  
        let DeltaX = 0, DeltaY = 0      
        switch (Direction) {
          case 'nw': DeltaX = HandleX+HandleW - FrameX; FrameX += DeltaX; FrameW -= DeltaX
                     DeltaY = HandleY+HandleH - FrameY; FrameY += DeltaY; FrameH -= DeltaY; break
          case 'n':  DeltaY = HandleY+HandleH - FrameY; FrameY += DeltaY; FrameH -= DeltaY; break
          case 'ne': DeltaX = HandleX - FrameX;                           FrameW  = DeltaX
                     DeltaY = HandleY+HandleH - FrameY; FrameY += DeltaY; FrameH -= DeltaY; break
          case 'e':  DeltaX = HandleX - FrameX;                           FrameW  = DeltaX; break
          case 'se': DeltaX = HandleX - FrameX;                           FrameW  = DeltaX
                     DeltaY = HandleY - FrameY;                           FrameH  = DeltaY; break
          case 's':  DeltaY = HandleY - FrameY;                           FrameH  = DeltaY; break
          case 'sw': DeltaX = HandleX+HandleW - FrameX; FrameX += DeltaX; FrameW -= DeltaX
                     DeltaY = HandleY - FrameY;                           FrameH  = DeltaY; break
          case 'w':  DeltaX = HandleX+HandleW - FrameX; FrameX += DeltaX; FrameW -= DeltaX; break
        }
      }
    }
  </script>
  
  <div style="
    display:block; position:relative;
    width:400px; height:400px;
    border:solid 1px black
  ">
    <div class="draggable SelectionFrame" style="
      left:{FrameX}px; top:{FrameY}px; width:{FrameW}px; height:{FrameH}px
    " use:draggable={{
      containment:'parent'
    }} on:drag:move={onFrameDragMove}
    ></div>
  
    <div class="draggable ResizeHandle" style="
      left:{HandleX('nw',FrameX,FrameW)}px; top:{HandleY('nw',FrameY,FrameH)}px; cursor:nwse-resize
    " use:draggable={{ helper:'clone', revert:true }}
      on:drag:move={onHandleDragMove('nw')}
    ></div>
    <div class="draggable ResizeHandle" style="
      left:{HandleX('n', FrameX,FrameW)}px; top:{HandleY('n', FrameY,FrameH)}px; cursor:ns-resize
    " use:draggable={{ helper:'clone', revert:true }}
      on:drag:move={onHandleDragMove('n')}
    ></div>
    <div class="draggable ResizeHandle" style="
      left:{HandleX('ne',FrameX,FrameW)}px; top:{HandleY('ne',FrameY,FrameH)}px; cursor:nesw-resize
    " use:draggable={{ helper:'clone', revert:true }}
      on:drag:move={onHandleDragMove('ne')}
    ></div>
    <div class="draggable ResizeHandle" style="
      left:{HandleX('e', FrameX,FrameW)}px; top:{HandleY('e', FrameY,FrameH)}px; cursor:ew-resize
    " use:draggable={{ helper:'clone', revert:true }}
      on:drag:move={onHandleDragMove('e')}
    ></div>
    <div class="draggable ResizeHandle" style="
      left:{HandleX('se',FrameX,FrameW)}px; top:{HandleY('se',FrameY,FrameH)}px; cursor:nwse-resize
    " use:draggable={{ helper:'clone', revert:true }}
      on:drag:move={onHandleDragMove('se')}
    ></div>
    <div class="draggable ResizeHandle" style="
      left:{HandleX('s', FrameX,FrameW)}px; top:{HandleY('s', FrameY,FrameH)}px; cursor:ns-resize
    " use:draggable={{ helper:'clone', revert:true }}
      on:drag:move={onHandleDragMove('s')}
    ></div>
    <div class="draggable ResizeHandle" style="
      left:{HandleX('sw',FrameX,FrameW)}px; top:{HandleY('sw',FrameY,FrameH)}px; cursor:nesw-resize
    " use:draggable={{ helper:'clone', revert:true }}
      on:drag:move={onHandleDragMove('sw')}
    ></div>
    <div class="draggable ResizeHandle" style="
      left:{HandleX('w', FrameX,FrameW)}px; top:{HandleY('w', FrameY,FrameH)}px; cursor:ew-resize
    " use:draggable={{ helper:'clone', revert:true }}
      on:drag:move={onHandleDragMove('w')}
    ></div>
    <slot></slot>
  </div>
  