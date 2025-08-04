var dizi2 = [];

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
        if (dizi2.map(x => x.isim).includes(deger)) {
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
    $("#fatal").click(function () {
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
        dizi2.sort(function (a, b) { return a.yapildi - b.yapildi })
        localStorageKaydet();
        renderTasks();
    }
    window.alfabetik = function () {
        dizi2.sort(function(a,b){return a.isim.localeCompare(b.isim)});
        localStorageKaydet();
        renderTasks();
    };
     window.tersAlfabetik = function () {
        dizi2.sort(function(a,b){return b.isim.localeCompare(a.isim)});
        localStorageKaydet();
        renderTasks();
    };
     window.yapilanOnde = function(){
         dizi2[gorevIndex].yapildi = checkboxElement.checked;
        dizi2.sort(function (a, b) { return b.yapildi - a.yapildi })
        localStorageKaydet();
        renderTasks();
     }
    function renderTasks() {
        $("#cardContainer").empty();


        dizi2.forEach(element => {
            let newCardHtml = `
            <div class="col-md-4 col-sm-6 mb-4" id="${element.id}">
                <div class="card shadow-sm bd-highlight">
                    <div class="card-body d-flex  align-items-center bd-highlight">
                     <input id="checkBox-${element.id}" class="p-2 bd-highlight align-items-start" onchange="toggleCheck(this,'${element.id}')" type="checkbox" ${element.yapildi ? 'checked' : ''}>
                        <h5 class="text-break card-title mb-0 p-2 flex-grow-1 bd-highlight ${element.yapildi ? 'text-decoration-line-through ' : ''}" id="text-${element.id}"  >${element.isim}</h5>
                        <button class="btn btn-sm p-2 bd-highlight align-items-sm-end" onclick="silme('${element.id}')"><img src="/img/delete.png" width=""></button>
                      
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