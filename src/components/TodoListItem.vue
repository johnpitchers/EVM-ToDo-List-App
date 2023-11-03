<template>
  <li class="todo-list-item list-group-item d-flex w-100" :class="{'isdone':todo.isDone}">
    <div class="d-flex flex-grow-1">
      <input name="isdone" type="checkbox" ref="doneCheck" class="form-check-input me-2" v-model="todo.isDone" @change="emit('persist')">
      <span v-show="!todo.edit" class="">{{ todo.task }}</span>
      <input name="task" type="text" v-show="todo.edit" ref="editbox" v-model="todo.task"
             :maxlength="maxTaskLength"
             @blur="emit('update',todo, index, false)"
             @keyup.enter="emit('update',todo, index, false)"
             @keyup.esc="emit('update',todo,index, false)">
      <small v-show="todo.edit" class="chars-left text-muted position-absolute bottom-0 end-0">
        {{ remainingCharacters }} characters left
      </small>
    </div>
    <div class="d-flex align-items-center">
      <Transition appear name="slide-fade">
        <button class="btn btn-primary btn-sm mx-1" v-show="!todo.isDone && !todo.edit" @click="editTodo(todo)"><i class="bi-pencil"></i></button>
      </Transition>
      <Transition appear name="slide-fade">
        <button class="btn btn-primary btn-sm mx-1" v-show="!todo.edit" @click="emit('delete',index)"><i class="bi-trash"></i></button>
      </Transition>
      <Transition appear name="slide-fade">
        <button class="btn btn-light btn-sm mx-1 drag-handle" v-show="!todo.edit"><i class="bi-arrow-down-up"></i></button>
      </Transition>
    </div>
  </li>
</template>

===========================================================

<script setup>
import {ref, computed} from "vue";

const props = defineProps({
  todo: Object,
  index: Number
});

const emit = defineEmits(['edit', 'update', 'delete', 'persist']);
const editbox = ref(null);
const doneCheck = ref(null);

// Why is maxTaskLength 120? The smart contract requires the task to be under 128 bytes.
// This allows for an emoji or 2 which can occupy up to 4 bytes.😊
const maxTaskLength = 120;
const remainingCharacters = computed(() => {
  return maxTaskLength - props.todo.task.length;
});

const editTodo = (todo) => {
  emit('edit', todo);
  window.requestAnimationFrame(() => {
    editbox.value.focus();
  });
};

</script>

===========================================================

<style lang="scss" scoped>

input[type="text"] {
  padding: 0 !important;
  border: none;
  outline: none !important;
  color: #0a53be;
  font-weight: bold;
  width: 100%;
}

.todo-list-item {
  span {
    transition: opacity ease 0.3s;
  }

  &.isdone {
    span {
      opacity: 0.3;
      text-decoration: line-through;
    }
  }
}

input[ref="editbox"] {
  border-width: 0;
}

.chars-left {
  font-size: 0.6em;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(6px);
  opacity: 0;
}

</style>
