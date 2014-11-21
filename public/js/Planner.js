Planner = function () {
    var plans = [];

    this.createEvent = function (item) {

    };

    this.saveEvent = function (item) {
        plans.push(item);
        popupHtml = item._popup._container.innerHTML;
        var businessName = $(popupHtml).find(".business-name").html();
        var html = '<li id="' + item.item.id + '">\
                        <time class="cbp_tmtime" datetime=""><h6>' + item.duration + '</h6></time>\
                            <i class="cbp_tmicon rounded-x hidden-xs"></i>\
                            <div class="cbp_tmlabel">\
                                <ul class="no-margin list-inline down-ul business-name">' + businessName + '</ul>\
                            </div>\
                    </li>';
        $(".timeline-v2").append(html);
    };

    this.getEvent = function () {
        return plans;
    };

    this.getLastEvent = function () {
        if (plans.length > 0) {
            return plans[plans.length - 1];
        } else {
            return null;
        }
    };

    this.getTimeLine = function () {
        var html = '<div class="headline headline-md no-margin"><h2>Timeline</h2></div>\
                    <ul class="timeline-v2"></ul>';
        return html;
    };
};