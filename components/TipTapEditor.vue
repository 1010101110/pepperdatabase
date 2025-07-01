<script setup>
import { onUpdated, watch } from 'vue';

//bind model value
const model = defineModel({default:'vmodel not initialized?'})
const emit = defineEmits(['update:modelValue'])

const {editable = true, label = ''} = defineProps({
  editable: Boolean,
  label:String,
})

const editor = useEditor({
  content: model.value,
  extensions: [TiptapStarterKit],
  editable:editable,
  onUpdate: ({editor}) => {
    //set the bind value
    let content = editor.getHTML()
    emit('update:modelValue', content)
  }
});

onBeforeUnmount(() => {
  unref(editor).destroy();
});
</script>

<template>
  <div class="pa-1 mb-2 position-relative">
    <div class="editorOverlay"></div>
    <label class="text-caption pl-3 opacity-70">{{ label }}</label>
    <div v-if="editor && editable">
      <v-btn size="x-small" class="mr-1"
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        bold
      </v-btn>
      <v-btn size="x-small" class="mr-1"
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        italic
      </v-btn>
      <v-btn size="x-small" class="mr-1"
        @click="editor.chain().focus().toggleStrike().run()"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
      >
        strike
      </v-btn>
      <v-btn size="x-small" class="mr-1"
        @click="editor.chain().focus().toggleCode().run()"
        :disabled="!editor.can().chain().focus().toggleCode().run()"
        :class="{ 'is-active': editor.isActive('code') }"
      >
        code
      </v-btn>
      <v-btn size="x-small" class="mr-1" @click="editor.chain().focus().unsetAllMarks().run()">
        clear marks
      </v-btn>
      <v-btn size="x-small" class="mr-1" @click="editor.chain().focus().clearNodes().run()">
        clear nodes
      </v-btn>
      <v-btn size="x-small" class="mr-1"
        @click="editor.chain().focus().setParagraph().run()"
        :class="{ 'is-active': editor.isActive('paragraph') }"
      >
        paragraph
      </v-btn>
      <v-btn size="x-small" class="mr-1"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
      >
        h1
      </v-btn>
      <v-btn size="x-small" class="mr-1"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
      >
        h2
      </v-btn>
      <v-btn size="x-small" class="mr-1"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
      >
        h3
      </v-btn>
      <v-btn size="x-small" class="mr-1"
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
      >
        h4
      </v-btn>
      <v-btn size="x-small" class="mr-1"
        @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
      >
        h5
      </v-btn>
      <v-btn size="x-small" class="mr-1"
        @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
      >
        h6
      </v-btn>
      <v-btn size="x-small" class="mr-1"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
      >
        bullet list
      </v-btn>
      <v-btn size="x-small" class="mr-1"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
      >
        ordered list
      </v-btn>
      <v-btn size="x-small" class="mr-1"
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor.isActive('codeBlock') }"
      >
        code block
      </v-btn>
      <v-btn size="x-small" class="mr-1"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
      >
        blockquote
      </v-btn>
      <v-btn size="x-small" class="mr-1" @click="editor.chain().focus().setHorizontalRule().run()">
        horizontal rule
      </v-btn>
      <v-btn size="x-small" class="mr-1" @click="editor.chain().focus().setHardBreak().run()">
        hard break
      </v-btn>
      <v-btn size="x-small" class="mr-1"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor.can().chain().focus().undo().run()"
      >
        undo
      </v-btn>
      <v-btn size="x-small" class="mr-1"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor.can().chain().focus().redo().run()"
      >
        redo
      </v-btn>
    </div>
    <TiptapEditorContent :editor="editor" class="pl-3" />
  </div>
</template>

<style>
.editorOverlay{
  background-color: currentColor;
  opacity: 0.04;
  position: absolute;
  top:0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>