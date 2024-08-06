import Swal from "sweetalert2";

export const errorModal = (text: string | Array<string>) => {
  const errorMessage = Array.isArray(text) ? text.join('\n') : text;

  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: errorMessage,
    background: '#0e0e0e', 
    color: '#fff',      
    didOpen: () => {
      const popup = Swal.getPopup();
      if (popup) {
        popup.style.backgroundColor = '#0e0e0e'; 
        popup.style.color = '#fff';            
      }
    },
  });
};
