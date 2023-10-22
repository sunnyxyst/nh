var clicked = true;
const selectedRowIds = [];
const todayDate = moment().format('YY/MM/DD');
const twoWeekday = new Array();

for(var i = 0; i < 14; i++) {
    twoWeekday[13 - i] = moment().add(-i, 'days').format('YY/MM/DD');
}

function headerTitle(title, id) {
    const searchFilter = document.getElementById(id);
    const createTitle = document.createElement('h2');
    
    createTitle.innerText = title;
    searchFilter.appendChild(createTitle);
}

function orderNumber(data, type, row, data) {
    return data.row + data.settings._iDisplayStart + 1;
}

function momentDate(data) {
    return (moment(data).isValid()) ? moment(data).format("YY/MM/DD") : "-";
}

function linkPath(data, type, row) {
    const oabPageId = data.substr(0, 9);
    const abPageStart = data.substr(0, 1);
    const abPage = (abPageStart == "H" || "F" || "P" || "E" || "T" || "A" || "I" || "A" || "N" || "U" || "B" || "C" || "G" || "M" || "S" || "L");
    const pageId = data.substr(0, 2);
    const rowPath = row.path;

    if(pageId === 'UI') {
        return '<a class="preview-link" href="../../' + rowPath + '/' + oabPageId + '/' + data + '.html" target="_blank">' + data + '</a>';
    } else if(abPage) {
        return '<a class="preview-link" href="../html/'+ rowPath + '/' + pageId + '/' + data + '.html" target="_blank">' + data + '</a>';
    } else {
        return '-';
    }
}

function linkCmsPath(data, type, row) {
    const rowPath = row.path;
    const pageId = data.substr(0, 2);
    const oabPageId = data.substr(0, 9);
    const cmsOab = data.includes('_iframe0') || data.includes('_iframe1');
    const cmsAb = data.includes('F0');
    const cmsOpenflag = data.includes('openflag') || data.includes('_notice');
    const cmsOabHtml = data.includes('.html');
    const cmsOabData = data.slice(0, -5);
    const oabPath = rowPath.includes('contents');

    if(cmsOabHtml && !oabPath) {
        return '<a class="preview-link" href="../../cms/' + rowPath + '/' + data + '" target="_blank">' + cmsOabData + '</a>';
    } else if(cmsOab || (cmsOab && pageId === 'UI' || cmsOpenflag)) {
        return '<a class="preview-link" href="../../cms/' + rowPath + '/' + data + '.html" target="_blank">' + data + '</a>';
    } else if (cmsAb) {
        return '<a class="preview-link" href="../cms/' + rowPath + '/' + pageId + '/' + data + '.html" target="_blank">' + data + '</a>';
    } else if((!cmsOab && pageId === 'UI')) {
        return '<a class="preview-link" href="../../' + rowPath + '/' + oabPageId + '/' + data + '.html" target="_blank">' + data + '</a>'
    } else {
        return data;
    }
}

function statusUpdate(data, type, row) {
    if(data === "퍼블완료") {
        return '<strong class="orange">' + data + '</strong>'
    } else if(data === "검증반영") {
        return '<strong class="red">' + data + '</strong>'
    } else if (data === "운영완료") {
        return '<strong class="green">' + data + '</strong>'
    } else if (data === "삭제") {
        return data
    } else {
        return data
    }
}

function previewPop() {
    const pagePreview = document.querySelectorAll('.preview-link');
    pagePreview.forEach(function(e) {
        e.addEventListener('mouseenter', (el) => {
            const parentEle = el.target;
            //console.log(parentEle)
            const previewDiv = document.createElement('div');
            previewDiv.classList.add('previewLayer');
            previewDiv.innerHTML = '<iframe src="' + e.getAttribute("href") + '"></iframe>';
            parentEle.appendChild(previewDiv);
        })
        e.addEventListener('mouseleave', (el) => {
            const previewLayer = el.target.querySelector('.previewLayer');
            previewLayer.remove();
        })
    })
}

function footerNote() {
    const footerWrap = document.querySelector('.footer-wrap');
    const guideNav = document.createElement('a');
    const footerNote = document.createElement('div');
    const dropDownWrap = document.createElement('div');
    
    footerNote.className ="pub-state";
    guideNav.id = 'pubGuideButton';
    guideNav.className = 'btn btn-sm';
    guideNav.innerText = "퍼블리싱 가이드";
    
    footerNote.innerHTML = " <strong class='orange'>퍼블완료</strong>: 퍼블 완료 | <strong class='red'>검증반영</strong>: 검증서버 반영 | <strong class='green'>운영완료</strong>: 운영서버 반영"
    
    dropDownWrap.className = 'dropdown';

    footerWrap.appendChild(footerNote);
    footerWrap.appendChild(dropDownWrap);
    dropDownWrap.appendChild(guideNav);

    dropDownWrap.addEventListener('click', function() {
        guideNav.href = '../guide.html';
        guideNav.target = '_blank';
    });
}

const cmsList = document.getElementById('cmsList');
const workList = document.getElementById('worklist');

if(workList) {
    
    const workTable = $(workList).DataTable({
        data: listData.data,
        deferRender: true,
        columns: [
            {data: 'num', className: 'col-count'},
            {data: 'cats', className: 'col-cats'},
            {data: 'depth.level2', className: 'col-depth2'},
            {data: 'depth.level3', className: 'col-depth3'},
            {data: 'depth.level4', className: 'col-depth4'},
            {data: 'depth.level5', className: 'col-depth5'},
            {data: 'depth.level6', className: 'col-depth6'},
            {data: 'pageID', className: 'col-ids'},
            {data: 'pageType', className: 'col-type'},
            {data: 'plan', className: 'col-plan'},
            {data: 'pub', className: 'col-pub'},
            {data: 'done', className: 'col-done'},
            {data: 'modify', className: 'col-modify'},
            {data: 'status', className: 'col-status'},
            {data: 'note', className: 'col-note'},
        ],
        responsive: true,
        paging: false,
        scrollY: '750px',
        scrollCollapse: true,
        rowGroup: { dataSrc: 'cats' },
        searchPanes:{
            panes: [
                {
                    options: [
                        {
                            label:'메인',
                            value: function(rowData, rowIdx){
                                return rowData.cats === '메인';
                            }
                        },
                        {
                            label:'금융',
                            value: function(rowData, rowIdx){
                                return rowData.cats === '금융';
                            }
                        },
                        {
                            label:'계좌관리',
                            value: function(rowData, rowIdx){
                                return rowData.cats === '계좌관리';
                            }
                        },
                        {
                            label:'결제',
                            value: function(rowData, rowIdx){
                                return rowData.cats === '결제';
                            }
                        },
                        {
                            label:'외환',
                            value: function(rowData, rowIdx){
                                return rowData.cats === '외환';
                            }
                        },
                        {
                            label:'공과금',
                            value: function(rowData, rowIdx){
                                return rowData.cats === '공과금';
                            }
                        },
                        {
                            label:'상품',
                            value: function(rowData, rowIdx){
                                return rowData.cats === '상품';
                            }
                        },
                        {
                            label:'생활+',
                            value: function(rowData, rowIdx){
                                return rowData.cats === '생활+';
                            }
                        },
                        {
                            label:'마이올원',
                            value: function(rowData, rowIdx){
                                return rowData.cats === '마이올원';
                            }
                        },
                        {
                            label:'큰글뱅킹',
                            value: function(rowData, rowIdx){
                                return rowData.cats === '큰글뱅킹';
                            }
                        },
                        {
                            label:'공통',
                            value: function(rowData, rowIdx){
                                return rowData.cats === '공통';
                            }
                        },
                        {
                            label:'전체메뉴',
                            value: function(rowData, rowIdx){
                                return rowData.cats === '전체메뉴';
                            }
                        },
                        {
                            label:'금융그룹',
                            value: function(rowData, rowIdx){
                                return rowData.cats === '금융그룹';
                            }
                        },
                        {
                            label:'만14세미만',
                            value: function(rowData, rowIdx){
                                return rowData.cats === '만14세미만';
                            }
                        },
                    ],
                    className: 'filterWrap',
                    dtOpts:{ // define properties of the DataTables being used for an individual pane.
                        searching: false,
                        order: [[0, 'asc']]
                    }
                }
            ],
            controls: false,
            layout: 'columns-1',
            hideCount: true,
            collapse: false,
            select: true,
            initCollapsed: true,
        },
        columnDefs: [ // column definition init properties.
            { 
                defaultContent: "-",
                targets: 0, 
                searchable: false, 
                orderable: false,
                render: orderNumber,
            },
            { visible: false, targets: 1 },
            { orderable: false, targets: [2,3,4,5,6,8,9,10,13] },
            { targets: 7, render: linkPath },
            { targets: 8, defaultContent: "-", },
            { targets:[11,12], render: momentDate},
            { targets: 13, render: statusUpdate },
            { targets: ['_all'], searchPanes: { show: false }},
        ],
        // P - search Pane, f- (search)filtering input, t- the Table, i - table Information summary, p - pagination control, r - pRocessing display element
        dom: '<"worklist-header"P<"recent-view">f>r<"worklist-table"t><"worklist-footer"i<"footer-wrap">>',
        fnInitComplete: function() {
            const recentView = document.querySelector('.recent-view');
            const buttonWrap = document.createElement('div');
            const createRecent = document.createElement('button');
            const cmsNav = document.createElement('a');

            createRecent.id = 'recentButton';
            buttonWrap.className = 'viewButtonWrap';
            createRecent.className = 'btn btn-sm';
            createRecent.innerText = "최근 2주 수정내역";
            
            cmsNav.className = 'btn btn-sm';
            cmsNav.id = 'cmsListButton';
            cmsNav.innerText = "CMS 리스트";

            recentView.appendChild(buttonWrap);
            buttonWrap.appendChild(cmsNav);
            buttonWrap.appendChild(createRecent);

            cmsNav.addEventListener('click', function() {
                cmsNav.href = 'cms_index.html';
                cmsNav.target = '_blank';
            });
            
            createRecent.addEventListener('click', function(){
                if(clicked) {
                    workTable.columns(12).search(twoWeekday.join('|'), true, false).draw();
                    clicked = false;
                } else {
                    workTable.columns(12).search("", true, false).draw();
                    clicked = true;
                }
            });
            headerTitle('|| WORKLIST', 'worklist_filter');
            footerNote();

            this.api().columns([9, 10, 13]).every(function() {
                const column = this;
                const select = document.createElement('select');
                select.className = 'head-filter';
                column.header().appendChild(select);

                select.addEventListener('change', function() {
                    var val = DataTable.util.escapeRegex(select.value);
                    column.search(val ? '^' + val + '$' : '', true, false).draw();
                });

                select.addEventListener('click', function(e){
                    e.stopPropagation();
                });

                column.data().unique().sort().each(function (d, j) {
                    select.add(new Option(d));
                })
            });
            previewPop();
        },
        createdRow: function(row, data, dataIndex, cells) {
            if(data.status === "삭제") {
                $(row).addClass('deleted')
            } else if(data.pageType === "native") {
                $(row).addClass('native')
            }
        },
    });

} else {
    const cmsTable = $(cmsList).DataTable({
        data: cmsData.data,
        deferRender: true,
        columns: [
            {data: 'num', className: 'col-count'},
            {data: 'server', className: 'col-server'},
            {data: 'depth.level2', className: 'col-depth2'},
            {data: 'depth.level3', className: 'col-depth3'},
            {data: 'depth.level4', className: 'col-depth4'},
            {data: 'depth.level5', className: 'col-depth5'},
            {data: 'depth.level6', className: 'col-depth6'},
            {data: 'pageID', className: 'col-ids'},
            {data: 'pageType', className: 'col-type'},
            {data: 'done', className: 'col-done'},
            {data: 'modify', className: 'col-modify'},
            {data: 'status', className: 'col-status'},
            {data: 'note', className: 'col-note'},
        ],
        responsive: true,
        paging: false,
        scrollY: '600px',
        scrollCollapse: true,
        rowGroup: { dataSrc: 'depth.level2'},
        columnDefs: [ // column definition init properties.
            { 
                defaultContent: "-",
                targets: 0, 
                searchable: false, 
                orderable: false,
                render: orderNumber,
            },
            { defaultContent: "efabwas", targets: 1},
            //{ visible: false, targets: 1 },
            { targets: 7, render: linkCmsPath },
            { targets:[9,10], render: momentDate },
            { targets: ['_all'], searchPanes:{show: false}},
            { orderable: false, targets: [2,3,4,5,6,7,8,11] },
            { targets: 11, render: statusUpdate },
        ],
        searchPanes:{
            panes: [
                {
                    options: [
                        {
                            label:'메인',
                            value: function(rowData, rowIdx){
                                return rowData.depth.level2 === '메인';
                            }
                        },
                        {
                            label:'금융',
                            value: function(rowData, rowIdx){
                                return rowData.depth.level2 === '금융';
                            }
                        },
                        {
                            label:'계좌관리',
                            value: function(rowData, rowIdx){
                                return rowData.depth.level2 === '계좌관리';
                            }
                        },
                        {
                            label:'결제',
                            value: function(rowData, rowIdx){
                                return rowData.depth.level2 === '결제';
                            }
                        },
                        {
                            label:'외환',
                            value: function(rowData, rowIdx){
                                return rowData.depth.level2 === '외환';
                            }
                        },
                        {
                            label:'공과금',
                            value: function(rowData, rowIdx){
                                return rowData.depth.level2 === '공과금';
                            }
                        },
                        {
                            label:'상품',
                            value: function(rowData, rowIdx){
                                return rowData.depth.level2 === '상품';
                            }
                        },
                        {
                            label:'생활+',
                            value: function(rowData, rowIdx){
                                return rowData.depth.level2 === '생활+';
                            }
                        },
                        {
                            label:'마이올원',
                            value: function(rowData, rowIdx){
                                return rowData.depth.level2 === '마이올원';
                            }
                        },
                        {
                            label:'큰글뱅킹',
                            value: function(rowData, rowIdx){
                                return rowData.depth.level2 === '큰글뱅킹';
                            }
                        },
                        {
                            label:'공통',
                            value: function(rowData, rowIdx){
                                return rowData.depth.level2 === '공통';
                            }
                        },
                        {
                            label:'전체메뉴',
                            value: function(rowData, rowIdx){
                                return rowData.depth.level2 === '전체메뉴';
                            }
                        },
                        {
                            label:'금융그룹',
                            value: function(rowData, rowIdx){
                                return rowData.depth.level2 === '금융그룹';
                            }
                        },
                        {
                            label:'만14세미만',
                            value: function(rowData, rowIdx){
                                return rowData.depth.level2 === '만14세미만';
                            }
                        },
                    ],
                    className: 'filterWrap',
                    dtOpts:{ // define properties of the DataTables being used for an individual pane.
                        searching: false,
                        order: [[0, 'asc']]
                    }
                }
            ],
            controls: false,
            layout: 'columns-1',
            hideCount: true,
            collapse: false,
            select: true,
            initCollapsed: true,
        },
        dom: '<"worklist-header"P<"recent-view">Bf>r<"worklist-table"t><"worklist-footer"i<"footer-wrap">>',
        createdRow: function(row, data, dataIndex, cells) {
            if(data.status === "삭제") {
                $(row).addClass('deleted')
            }
        },
        buttons: ['excel'],
        fnInitComplete: function() {
            const recentView = document.querySelector('.recent-view');
            const buttonWrap = document.createElement('div');
            const createRecent = document.createElement('button');
            const cmsNav = document.createElement('a');

            
            createRecent.id = 'recentButton';
            buttonWrap.className = 'viewButtonWrap';
            createRecent.className = 'btn btn-sm';
            createRecent.innerText = "최근 2주 수정내역";
            
            cmsNav.className = 'btn btn-sm';
            cmsNav.id = 'cmsListButton';
            cmsNav.innerText = "워크리스트";

            recentView.appendChild(buttonWrap);
            buttonWrap.appendChild(cmsNav);
            buttonWrap.appendChild(createRecent);

            cmsNav.addEventListener('click', function() {
                cmsNav.href = 'cms_index.html';
                cmsNav.target = '_blank';
            });

            createRecent.addEventListener('click', function(){
                if(clicked) {
                    cmsTable.columns(10).search(twoWeekday.join('|'), true, false).draw();
                    clicked = false;
                } else {
                    cmsTable.columns(10).search("", true, false).draw();
                    clicked = true;
                }
            });
            headerTitle('|| CMS LIST','cmsList_filter');
            footerNote();
            previewPop();
        }
    });
    
    // cmsTable.button().add(0, {
    //     text: 'Excel'
    // })
}