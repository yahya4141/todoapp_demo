var dizi2 = [];
let currentSort = "yapilmamisOnde";
let guncellenecekId = null;
$(document).ready(function () {
    localStorageYukle();
    renderTasks();

    $("#addButton").click(function () {
        var deger = $("#actionInput").val().trim();

        if (deger === "") {
            return;
        }
        const uniqueCardId = `card-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const yeniGorev = {
            id: uniqueCardId,
            isim: deger,
            yapildi: false
        }
        if (dizi2.some(x => x.isim.toLowerCase() === deger.toLowerCase())) {
            return;
        }

        dizi2.push(yeniGorev);
        localStorageKaydet();
        document.getElementById(`actionInput`).value = '';
        renderTasks();


    });
    function localStorageYukle() {
        let storedTasks = localStorage.getItem("gorevListesi")
        if (storedTasks) {
            dizi2 = JSON.parse(storedTasks);
        }
    }
    $("#delAll").click(function () {
        dizi2 = [];
        localStorageKaydet();
        renderTasks();
    });
    window.silme = function (cardId) {
        $(`#${cardId}`).remove();
        dizi2 = dizi2.filter(gorev => gorev.id !== cardId);
        localStorageKaydet();
        renderTasks();
    }
    window.toggleCheck = function (checkboxElement, cardId) {
        const gorevIndex = dizi2.findIndex(task => task.id === cardId);

        if (gorevIndex == -1) return;

        dizi2[gorevIndex].yapildi = checkboxElement.checked;
        // dizi2.sort(function (a, b) { return a.yapildi - b.yapildi })
        localStorageKaydet();
        renderTasks();
    }
  
      
      window.gorevGuncelle = function () {
        if(!guncellenecekId) return;
        const gorevIndex = dizi2.findIndex(task => task.id === guncellenecekId);
        if (gorevIndex === -1) return;
            const yeniIsim = $("#modalInput").val().trim();
        if (yeniIsim === "") {
            return;
        }
        if (dizi2.some(x => x.isim.toLowerCase() === yeniIsim.toLowerCase() && x.id !== guncellenecekId)) {
            return;
        }
        dizi2[gorevIndex].isim = yeniIsim;
        localStorageKaydet();
        $("#modalInput").val('');
        guncellenecekId = null;
        $("#modalEdit").modal('hide');
        renderTasks();
    }
    
    window.alfabetik = function () {
        currentSort = "alfabetik";
        renderTasks();
    };
    window.tersAlfabetik = function () {
        currentSort = "tersAlfabetik";
        renderTasks();
    };
    window.yapilanOnde = function () {
        currentSort = "yapilanOnde";
        renderTasks();
    };
    window.yapilmamisOnde = function () {
        currentSort = "yapilmamisOnde";
        renderTasks();
    };
    function renderTasks() {
        $("#cardContainer").empty();
        switch (currentSort) {
            case "alfabetik":
                dizi2.sort((a, b) => a.isim.localeCompare(b.isim));
                break;
            case "tersAlfabetik":
                dizi2.sort((a, b) => b.isim.localeCompare(a.isim));
                break;
            case "yapilanOnde":
                dizi2.sort((a, b) => b.yapildi - a.yapildi);
                break;
            case "yapilmamisOnde":
                dizi2.sort((a, b) => a.yapildi - b.yapildi);
                break;
        }

        dizi2.forEach(element => {
            let newCardHtml = `
            <div class="col-md-4 col-sm-6 mb-4" id="${element.id}">
                <div class="card shadow-sm bd-highlight">
                    <div class="card-body d-flex align-items-center bd-highlight">
                        <input id="checkBox-${element.id}" class="p-2 bd-highlight align-items-start" onchange="toggleCheck(this,'${element.id}')" type="checkbox" ${element.yapildi ? 'checked' : ''}>
                        <h5 class="text-break card-title mb-0 p-2 flex-grow-1 bd-highlight ${element.yapildi ? 'text-decoration-line-through' : ''}" id="text-${element.id}">${element.isim}</h5>
                        <button  class="btn btn-warning btn-sm p-2 bd-highlight align-items-sm-end edit-button"  data-bs-toggle="modal" data-bs-target="#modalEdit" onclick="guncellenecekId='${element.id}'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.522 1.522L.39 12.35l-1.522-1.522.106-.106a.5.5 0 0 1 .707 0z"/>
                            </svg>
                        </button>
                        <button class="btn btn-danger btn-sm p-2 bd-highlight align-items-sm-end" onclick="silme('${element.id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>`;
            $("#cardContainer").append(newCardHtml);
        });

    }
    function localStorageKaydet() {
        let dizi2_serialized = JSON.stringify(dizi2);
        localStorage.setItem("gorevListesi", dizi2_serialized);
    }

});