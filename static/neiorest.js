$(function() {
    initHandlers();
    $('.responsecontainer > .panel-body').toggle();

    $('.templatesave').click(function(e) {
        var name = $(e.target).closest('.templatesavecontainer').find('input[name="templateName"]').val();
        var form = $(e.target).closest('.requestcontainer').find('.requestform');

        data = form.serializeArray();
        data.push({name: 'templateName', value: name});

        $(e.target).button('loading');
        $.ajax({
            method: 'POST',
            url: '/save',
            data: data,
            success: function (data) {
                console.log('success');
                console.log(data);
                $(e.target).button('reset');
            },
            error: function (data) {
                console.log('error');
                console.log(data);
                $(e.target).button('reset');
            }
        });

        e.preventDefault();
    });

    $('.templateselect > select').change(function (e) {
        var name = $(e.target).val();

        if (name == '') {
            console.log('None selected');
        } else {
            console.log(name);
            $.ajax({
                url: '/load',
                method: 'POST',
                data: 'templateName=' + name,
                success: function (data) {
                    console.log('success');
                    $(e.target).closest('.requestcontainer').find('.panel-body').html(data);
                    initHandlers();
                    $(e.target).closest('.requestcontainer').find('input[name="templateName"]').val(name);
                },
                error: function (data) {
                    console.log('error');
                },
            });
        }

        e.preventDefault();
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

function initHandlers() {
    $('.requestform').submit(function (e) {
        var form = $(e.target);
        var data = form.serializeAll();
        var btn = $(e.target).find('button[type="submit"]');
        btn.button('loading');

        console.log(data);

        $.ajax({
            url: '/query',
            method: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                showResponse(data);
                btn.button('reset');
            },
            error: function (data) {
                showResponse(data);
                btn.button('reset');
            },
        });

        $('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });

        e.preventDefault()
    });

    $('.parameteradd').click(function(e) {
        addParameter(e);
    });
    $('.parameterrem').click(function(e) {
        removeParameter(e);
    });
    $('.parametervis').click(function(e) {
        toggleParameter(e);
    });

    $('.parameterarea').click(function (e) {
        toggleParameterArea(e);
    });

    $('.panelmin').click(function (e) {
        var panel = $(e.target).closest('.panel');
        panel.find('.panel-body').toggle();
        e.preventDefault()
    });

    $('.methodselect > ul > li > a').click(function (e) {
        var method = $(e.target).html().toLowerCase();
        console.log(method);
        $(e.target).closest('.requestcontainer').find('input[name="requestMethod"]').val(method);
        $(e.target).closest('.requestcontainer').find('.currentMethod').html(method.toUpperCase());
    });

    $('.requestRaw').ace({theme: 'github', lang: 'json'});
}

function showResponse(data) {
    var response = data['content'];
    if (data['headers']['Content-Type'].match(/^application\/json/)) {
        var response = JSON.stringify(JSON.parse(response), null, 2);
    }
    $('.response').html(response);
    $('.response').closest('.panel-body').show();
    $('.responseStatus').html(data['status_code']);

    $('pre code').each(function(i, block) {
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
