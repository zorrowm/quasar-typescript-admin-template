<template>
  <div>
    <div class="row no-wrap justify-around q-px-md q-pt-md">
      <div v-mutation="handler1" @dragenter="onDragEnter" @dragleave="onDragLeave" @dragover="onDragOver" @drop="onDrop" class="drop-target rounded-borders overflow-hidden">
        <div id="box1" draggable="true" @dragstart="onDragStart" class="box navy" />
        <div id="box2" draggable="true" @dragstart="onDragStart" class="box red" />
        <div id="box3" draggable="true" @dragstart="onDragStart" class="box green" />
        <div id="box4" draggable="true" @dragstart="onDragStart" class="box orange" />
        <div id="box5" draggable="true" @dragstart="onDragStart" class="box navy" />
        <div id="box6" draggable="true" @dragstart="onDragStart" class="box red" />
        <div id="box7" draggable="true" @dragstart="onDragStart" class="box green" />
        <div id="box8" draggable="true" @dragstart="onDragStart" class="box orange" />
      </div>

      <div v-mutation="handler2" @dragenter="onDragEnter" @dragleave="onDragLeave" @dragover="onDragOver" @drop="onDrop" class="drop-target rounded-borders overflow-hidden" />
    </div>

    <div class="row justify-around items-start">
      <div class="col row justify-center q-pa-md">
        <div class="text-subtitle1">Mutation Info</div>
        <div v-for="status in status1" :key="status">{{ status }}</div>
      </div>

      <div class="col row justify-center q-pa-md">
        <div class="text-subtitle1">Mutation Info</div>
        <div v-for="status in status2" :key="status">{{ status }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';

@Component({
  name: 'myComponentTransfer',
})
export default class myComponentTransfer extends Vue {
  private status1: any[] = [];
  private status2: any[] = [];

  private handler1(mutationRecords: any[]) {
    this.status1 = [];
    for (const index in mutationRecords) {
      const record = mutationRecords[index];
      const info = `type: ${record.type}, nodes added: ${record.addedNodes.length > 0 ? 'true' : 'false'}, nodes removed: ${record.removedNodes.length > 0 ? 'true' : 'false'}, oldValue: ${
        record.oldValue
      }`;
      this.status1.push(info);
    }
  }

  private handler2(mutationRecords: any[]) {
    this.status2 = [];
    for (const index in mutationRecords) {
      const record = mutationRecords[index];
      const info = `type: ${record.type}, nodes added: ${record.addedNodes.length > 0 ? 'true' : 'false'}, nodes removed: ${record.removedNodes.length > 0 ? 'true' : 'false'}, oldValue: ${
        record.oldValue
      }`;
      this.status2.push(info);
    }
  }

  private onDragEnter(e: any) {
    // don't drop on other draggables
    if (e.target.draggable !== true) {
      e.target.classList.add('drag-enter');
    }
  }

  private onDragLeave(e: any) {
    e.target.classList.remove('drag-enter');
  }

  private onDragOver(e: any) {
    e.preventDefault();
  }

  // store the id of the draggable element
  private onDragStart(e: any) {
    e.dataTransfer.setData('text', e.target.id);
    e.dataTransfer.dropEffect = 'move';
  }

  private onDrop(e: any) {
    e.preventDefault();

    // don't drop on other draggables
    if (e.target.draggable === true) {
      return;
    }

    const draggedId = e.dataTransfer.getData('text');
    const draggedEl: any = document.getElementById(draggedId);

    // check if original parent node
    if (draggedEl.parentNode === e.target) {
      e.target.classList.remove('drag-enter');
      return;
    }

    // make the exchange
    draggedEl.parentNode.removeChild(draggedEl);
    e.target.appendChild(draggedEl);
    e.target.classList.remove('drag-enter');
  }
}
</script>

<style scoped lang="scss">
.drop-target {
  height: 400px;
  width: 200px;
  min-width: 200px;
  background-color: gainsboro;
}

.drag-enter {
  outline-style: dashed;
}

.box {
  width: 100px;
  height: 100px;
  float: left;
  cursor: pointer;
}

@media only screen and (max-width: 500px) {
  .drop-target {
    height: 200px;
    width: 100px;
    min-width: 100px;
    background-color: gainsboro;

    .box {
      width: 50px;
      height: 50px;
    }
  }
}

.box:nth-child(3) {
  clear: both;
}

.navy {
  background-color: navy;
}

.red {
  background-color: firebrick;
}

.green {
  background-color: darkgreen;
}

.orange {
  background-color: orange;
}
</style>
