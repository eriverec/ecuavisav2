import axios from "@axios";
import { defineStore } from "pinia";

export const useBannersListStore = defineStore("BannersListStore", {
  actions: {
    fetchCategorias() {
      return axios.get(
        "https://estadisticas.ecuavisa.com/sites/gestor/Tools/miecuavisa/index.php"
      );
    },

    sendCategorias(dato) {
      return new Promise((resolve, reject) => {
        let body = JSON.stringify(dato);

        let config = {
          method: "POST",
          maxBodyLength: Infinity,
          url: "https://estadisticas.ecuavisa.com/sites/gestor/Tools/miecuavisa/ajax.php",
          headers: {
            "Content-Type": "application/json",
          },
          data: body,
        };
        axios
          .request(config)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
  },
});
