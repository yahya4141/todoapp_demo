var dizi2 = [];
let currentSort = "yapilmamisOnde";
let option = "1";
let guncellenecekId = null;

$(document).ready(function () {

    localStorageYukle();
    renderTasks();
    
    $("#searchInput").on("keyup", function () {
        renderTasks();
    });


    $("#cardContainer").on("click", ".edit-button", function() {
        guncellenecekId = $(this).data("id");
    });
    

    $('#modalEdit').on('show.bs.modal', function (e) {
        if (guncellenecekId === null) {
            // Yeni görev ekleme
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const todayForInput = `${yyyy}-${mm}-${dd}`;

            $("#modalInput").val('');
            $("#selectList").val("1");
            $("#dateInput").val(todayForInput);
        } else {
           
            const gorev = dizi2.find(task => task.id === guncellenecekId);
            if (gorev) {
                $("#modalInput").val(gorev.isim);
                $("#selectList").val(gorev.tur);
                const parts = gorev.bitisTarihi.split('.');
                if (parts.length === 3) {
                    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                    $("#dateInput").val(formattedDate);
                } else {
                    $("#dateInput").val('');
                }
            }
        }
    });

    $('#modalEdit').on('hide.bs.modal', function (e) {
        guncellenecekId = null;
    });

    function showConfirm(message, callback) {
        const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
        document.getElementById('confirmMessage').textContent = message;
        document.getElementById('confirmOkButton').onclick = () => {
            modal.hide();
            callback();
        };
        modal.show();
    }
    
    function localStorageYukle() {
        let storedTasks = localStorage.getItem("gorevListesi");
        if (storedTasks) {
            dizi2 = JSON.parse(storedTasks);
        }
    }
    
    $("#delAll").click(function () {
        showConfirm('Tüm görevleri silmek istediğinizden emin misiniz?', () => {
            dizi2 = [];
            localStorageKaydet();
            renderTasks();
        });
    });
    
    window.silme = function (cardId) {
        $(`#${cardId}`).remove();
        dizi2 = dizi2.filter(gorev => gorev.id !== cardId);
        localStorageKaydet();
        renderTasks();
    }
    
    window.toggleCheck = function (checkboxElement, cardId) {
        const gorevIndex = dizi2.findIndex(task => task.id === cardId);
        if (gorevIndex === -1) return;
        dizi2[gorevIndex].yapildi = checkboxElement.checked;
        localStorageKaydet();
        renderTasks();
    }
    
    window.gorevOlustur = function () {
        if (guncellenecekId === null) {
        
            const yeniIsim = $("#modalInput").val().trim();
            const yeniTur = $("#selectList").val();
            const yeniBitisTarihi = $("#dateInput").val();

            if (yeniIsim === "") {
                alert("Lütfen bir görev ismi giriniz.");
                return;
            }
            if (yeniTur === "1") {
                alert("Lütfen görev türünü seçiniz.");
                return;
            }
            if (!yeniBitisTarihi) {
                alert("Lütfen bitiş tarihi giriniz.");
                return;
            }

            const tarih = new Date();
            const formattedDate = tarih.toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });

            const tarih2 = new Date(yeniBitisTarihi);
            const tarih2f = tarih2.toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });

            const uniqueCardId = `card-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const yeniGorev = {
                tarih: formattedDate,
                bitisTarihi: tarih2f,
                id: uniqueCardId,
                isim: yeniIsim,
                yapildi: false,
                tur: yeniTur
            };

            if (dizi2.some(x => x.isim.toLocaleLowerCase('tr-TR') === yeniIsim.toLocaleLowerCase('tr-TR'))) {
                alert("Bu görev zaten mevcut.");
                return;
            }

            dizi2.push(yeniGorev);
            localStorageKaydet();
            $("#modalEdit").modal('hide');
            renderTasks();

        } else {
           
            const gorevIndex = dizi2.findIndex(task => task.id === guncellenecekId);
            if (gorevIndex === -1) return;

            const yeniIsim = $("#modalInput").val().trim();
            const yeniTur = $("#selectList").val();
            const yeniBitisTarihi = $("#dateInput").val();

            if (yeniIsim === "") {
                alert("Lütfen bir görev ismi giriniz.");
                return;
            }
            if (yeniTur === "1") {
                alert("Lütfen görev türünü seçiniz.");
                return;
            }
            if (!yeniBitisTarihi) {
                alert("Lütfen bitiş tarihi giriniz.");
                return;
            }

            const tarihObjesi = new Date(yeniBitisTarihi);
            const yeniBitisTarihiFormatted = tarihObjesi.toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });

            if (dizi2.some(x => x.isim.toLocaleLowerCase('tr-TR') === yeniIsim.toLocaleLowerCase('tr-TR') && x.id !== guncellenecekId)) {
                alert("Bu görev zaten mevcut.");
                return;
            }

            dizi2[gorevIndex].isim = yeniIsim;
            dizi2[gorevIndex].tur = yeniTur;
            dizi2[gorevIndex].bitisTarihi = yeniBitisTarihiFormatted;

            localStorageKaydet();
            $("#modalEdit").modal('hide');
            renderTasks();
        }
    };
    
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
        let filteredTasks = dizi2;
        const searchTerm = $("#searchInput").val().trim().toLocaleLowerCase('tr-TR');
        
        if (searchTerm !== "") {
            filteredTasks = dizi2.filter(task => task.isim.toLocaleLowerCase('tr-TR').includes(searchTerm));
        }
        
        switch (currentSort) {
            case "alfabetik":
                filteredTasks.sort((a, b) => a.isim.localeCompare(b.isim));
                break;
            case "tersAlfabetik":
                filteredTasks.sort((a, b) => b.isim.localeCompare(a.isim));
                break;
            case "yapilanOnde":
                filteredTasks.sort((a, b) => b.yapildi - a.yapildi);
                break;
            case "yapilmamisOnde":
                filteredTasks.sort((a, b) => a.yapildi - b.yapildi);
                break;
        }

        filteredTasks.forEach(element => {
            let newCardHtml = `
            <div class="col-md-4 col-sm-6 mb-4" id="${element.id}">
                <div class="card shadow-sm bd-highlight">
                    <div class="card-header p-3 align-items-center d-flex">
                        <h4 class="mb-0">Türü: ${element.tur}</h4>
                    </div>
                    <div class="align-items-center card-body d-flex bd-highlight">
                        <input id="checkBox-${element.id}" class="p-2 bd-highlight align-items-start" onchange="toggleCheck(this,'${element.id}')" type="checkbox" ${element.yapildi ? 'checked' : ''}>
                        <h5 class="text-break card-title mb-0 p-2 flex-grow-1 bd-highlight ${element.yapildi ? 'text-decoration-line-through' : ''}" id="text-${element.id}">${element.isim}</h5>
                        <button class="btn align-text-top btn-warning btn-sm mb-2 p-2 bd-highlight align-items-sm-end edit-button" data-bs-toggle="modal" data-bs-target="#modalEdit" data-id="${element.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.522 1.522L.39 12.35l-1.522-1.522.106-.106a.5.5 0 0 1 .707 0z"/>
                            </svg>
                        </button>
                        <button class="btn btn-danger btn-sm p-2 bd-highlight mb-2 align-items-sm-end" onclick="silme('${element.id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="card-footer text-muted">
                        <label>Oluşturma Tarihi: ${element.tarih}</label>
                        <label class="float-end">Bitiş Tarihi: ${element.bitisTarihi}</label>
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