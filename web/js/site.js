$(document).ready(function() {

    loadTemplates();
    $('#previewoptions').hide();
    $('#queryresult').hide();

    var currentTemplate;

    function loadTemplates() {
        $.getJSON(
            '/neio-rest/web/index.php?r=site/templates',
            null,
            function(data) {
                var templateslist = $('#templateslist');
                templateslist.empty();
                $.each(data, function(idx, val) {
                   templateslist.append('<p><a href="#" class="template">' + val.name + '</a></p>');
                });
                $('.template').click(templateClickHandler);
            }
        );
    }

    $('#deletebutton').click(function(e) {
        var name = $('#previewname').html();
        console.log(name);
        $.post('/neio-rest/web/index.php?r=site/delete', 'name=' + name, function(data) {
            if (data.status == 'error') {
            } else {
            }
            loadTemplates();
        });

        return e.preventDefault();
    });

    $('#loadbutton').click(function(e) {
        $('#method').val(currentTemplate.method);
        $('#apiurl').val(currentTemplate.apiurl);

        var len = currentTemplate.params_key.length;
        $('.params[id!="params-first"]').remove();
        var p = $('#params-first');
        for (var i = 0; i < len; i++) {
            if (i != 0) {
                p = addParams(p);
            }

            var status = currentTemplate.params_enabled[i];
            if (status == 'off') {
                p.find('#params_enabled').val(status);
                p.find('label').removeClass('btn-success').addClass('btn-info');
                p.find('.state').html('Off');
            }
            else {
                p.find('#params_enabled').val(status);
            }

            p.find('#params_key').val(currentTemplate.params_key[i]);
            p.find('#params_val').val(currentTemplate.params_val[i]);
        }

        return e.preventDefault();
    });

    function templateClickHandler(e) {
        var preview = $('#templatespreview > table');
        var name = $(this).html();

        $.getJSON(
            '/neio-rest/web/index.php?r=site/template',
            'name=' + name,
            function(data) {
                preview.empty();
                preview.append('<tr><th></th><th>Key</th><th>Value</th></tr>');
                preview.append('<tr><td></td><td>name</td><td id="previewname">' + data.name + '</td></tr>');
                preview.append('<tr><td></td><td>apiurl</td><td>' + data.apiurl + ' (' + data.method + ')</td></tr>');
                for (var i = 0; i < data.params_enabled.length; i++) {
                    preview.append('<tr class="' + (data.params_enabled[i] == 'on' ? 'success' : 'warning') +  ' "><td>param</td><td>' + data.params_key[i] + '</td><td>' + data.params_val[i] + '</td></tr>')
                }
                $('#previewoptions').show();
                currentTemplate = data;
            }
        );

        return e.preventDefault();
    }

    $('.addparam').click(function() {
        var params = $(this).closest('.params');
        addParams(params);
    });

    function addParams(params) {
        if (params == null) {
            params = $('#params-first');
        }
        var params_new = params.clone(true);
        params_new.find('input[type="text"]').val('').prop('disabled', false);
        params_new.find('label').removeClass('btn-info').addClass('btn-success');
        params_new.find('.state').html('On');
        params_new.find('input[type="hidden"]').val('on');
        params_new.find('input[type="button"]').val('Disable').removeClass('btn-success').addClass('btn-warning');
        params_new.removeAttr('id');
        params.after(params_new);

        return params_new;
    }

    $('.removeparam').click(function() {
        var params = $(this).closest('.params');
        if ($('.params').length == 1) {
             params.find('input[type="text"]').val('');
        } else {
            params.remove();
        }
    });

    $('.toggleparam').click(function(e) {
        var params = $(this).closest('.params');
        var state = $(this).find('span');
        var input = $(this).find('input');

        if (input.val() == 'off') {
            params.find('input[type="text"]').prop('disabled', false);
            input.val('on');
            state.html('On');
            $(this).removeClass('btn-info').addClass('btn-success');
        } else {
            params.find('input[type="text"]').prop('disabled', true);
            input.val('off');
            state.html('Off');
            $(this).removeClass('btn-success').addClass('btn-info');
        }

        e.preventDefault();
    });

    $('#savebutton').click(function(e) {
        var form = $('form');
        var form_old = $('form').clone(true);

        var name = prompt('Template name?');

        form.find('input').prop('disabled', false);

        console.log(form.serialize());

        $.post('/neio-rest/web/?r=site/save', form.serialize() + '&name=' + name, function(data) {
            if (data.status == 'error') {
            } else {
            }
            loadTemplates();
        }, 'json');

        form.replaceWith(form_old);
    });

    $('#submitbutton').click(function() {
        var form = $('form');

        $.post('/neio-rest/web/?r=site/query', form.serialize(), function(data) {
            $('#queryresult').empty().append(data.data.result);
            $('#queryresult').show();
        });
    });
});
