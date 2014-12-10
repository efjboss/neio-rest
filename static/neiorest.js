$(function() {
    $('.responsecontainer').each(function () {
        var container = $(this);

        $('.panel-body', container).hide();

        $('.panelmin', container).click(function (e) {
            var panel = $(e.target).closest('.panel');
            panel.find('.panel-body').toggle();
            e.preventDefault()
        });
    });

    $('.requestcontainer').each(function () {
        var container = $(this);
        $('.panel-body', container).show();
        initHandlers(container);

    });
});

(function ($) {
      $.fn.serializeAll = function () {
        var data = [];

        $('[name]', this).each(function () {
            var name = this.name;
            var value = $(this).val();

            if (this.type == 'checkbox') {
                value = $(this).prop('checked');
            }
            data.push({ name: name, value: value });
        });

        return data;
      }
    })(jQuery);

function initHandlers(container) {
    $('.requestform', container).submit(function (e) {
        e.preventDefault()
        var form = $(e.target);
        var data = form.serializeAll();
        var btn = $(e.target).find('button[type="submit"]');

        btn.button('loading');

        $.ajax({
            url: '/query',
            method: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                showResponse(container, data);
                btn.button('reset');
            },
            error: function (data) {
                showResponse(container, data);
                btn.button('reset');
            },
        });
    });

    $('.parameteradd', container).click(function(e) {
        addParameter(e);
    });
    $('.parameterrem', container).click(function(e) {
        removeParameter(e);
    });
    $('.parametervis', container).click(function(e) {
        toggleParameter(e);
    });

    $('.parameterarea', container).click(function (e) {
        toggleParameterArea(e);
    });

    $('.panelmin', container).click(function (e) {
        var panel = $(e.target).closest('.panel');
        panel.find('.panel-body').toggle();
        e.preventDefault()
    });

    $('.methodselect > ul > li > a', container).click(function (e) {
        var method = $(e.target).html().toLowerCase();
        $(e.target).closest('.requestcontainer').find('input[name="requestMethod"]').val(method);
        $(e.target).closest('.requestcontainer').find('.currentMethod').html(method.toUpperCase());
    });

    $('.requestRaw', container).ace({theme: 'github', lang: 'json'});

    $('.templatesave', container).click(function(e) {
        e.preventDefault();
        var name = $(e.target).closest('.templatesavecontainer').find('input[name="templateName"]').val();
        var form = $(e.target).closest('.requestcontainer').find('.requestform');

        data = form.serializeAll();
        data.push({name: 'templateName', value: name});

        $(e.target).button('loading');
        $.ajax({
            method: 'POST',
            url: '/save',
            data: data,
            success: function (data) {
                $(e.target).button('reset');
            },
            error: function (data) {
                $(e.target).button('reset');
            }
        });

        e.preventDefault();
    });

    $('.templateselect > select', container).change(function (e) {
        e.preventDefault();
        var name = $(e.target).val();

        if (name == '') {
        } else {
            $.ajax({
                url: '/load',
                method: 'POST',
                data: 'templateName=' + name,
                success: function (data) {
                    var queueitem = container.closest('.queuecontainer');
                    $(e.target).closest('.requestcontainer').replaceWith(data);
                    var newcontainer = $('.requestcontainer', queueitem);
                    initHandlers(newcontainer);
                    $('input[name="templateName"]', newcontainer).val(name);
                },
                error: function (data) {
                    console.log('error');
                },
            });
        }
    });
}

function showResponse(container, data) {
    var responseContainer = container.next('.responsecontainer');

    var response = data['content'];
    if (data['headers']['Content-Type'].match(/^application\/json/)) {
        var response = JSON.stringify(JSON.parse(response), null, 2);
    }

    $('.response', responseContainer).html(response);
    $('.response', responseContainer).closest('.panel-body').show();
    $('.responseStatus', responseContainer).html(data['status_code']);

    $('pre code', responseContainer).each(function(i, block) {
        hljs.highlightBlock(block);
    });
}

function addParameter(e) {
    var param = $(e.target).closest('div.parameter');
    var copy = param.clone();
    copy.find('input').val('');
    param.after(copy);
    copy.find('.parameteradd').click(addParameter);
    copy.find('.parameterrem').click(removeParameter);
    copy.find('.parametervis').click(toggleParameter);

    e.preventDefault();
}

function toggleParameterArea(e) {
    var valueInput = $(e.target).closest('.form-group').find('[name="requestValues"]');

    e.preventDefault();
}

function removeParameter(e) {
    var parameters = $('div.parameter');
    if (parameters.length < 2) {
        parameters.val('');
    } else {
        var parameter = $(e.target).closest('div.parameter');
        parameter.remove();
    }

    e.preventDefault();
}

function toggleParameter(e) {
    var parameter = $(e.target).closest('div.parameter');
    parameter.find('input[type="text"]').prop('disabled', function () {
        var res = !$(this).prop('disabled');
        var c1 = 'glyphicon-ok';
        var c2 = 'glyphicon-remove';
        $(e.target).find('span.glyphicon').removeClass(c1).removeClass(c2).addClass(!res ? c1 : c2);
        parameter.find('.parameterchk').prop('checked', !res);
        return res;
    });

    e.preventDefault();
}
