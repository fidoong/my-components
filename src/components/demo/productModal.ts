import ProductEditor, {type ProductEditorProps} from "@/components/demo/ProductEditor.vue";
import {getModel} from "@/components/modal";

const idx = Symbol("useProductEditorModal");

export const useProductEditorModal = () => {

  const modal = getModel<InstanceType<typeof ProductEditor>, ProductEditorProps>({
    idx,
    width: '800px',
    title: '测试弹窗33',
    showClose: false,
    draggable: true,
    content: ProductEditor
  })

  modal.onConfirm( async () => {
    if (modal.componentRef.value) {
      const data = await modal.componentRef.value.submitForm()
      console.log('data',data)
    }
  })

  return modal;
}
