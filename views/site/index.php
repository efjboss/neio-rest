<?php
    $this->title = 'REST_NEIO';
?>

<div class="col-lg-9">
    <form id="queryform" role="form">
        <div class="form-group col-lg-2">
            <label for="method" class="">Action</label>
            <select id="method" name="method" class="form-control">
                <option>GET</option>
                <option>POST</option>
            </select>
        </div>
        <div class="form-group col-lg-10">
            <label for="apiurl" class="">Url</label>
            <input id="apiurl" name="apiurl" type="text" class="form-control" />
        </div>

        <div class="paramlabels col-lg-12">
            <div class="form-group col-lg-1">
                <label for="params_enabled">State</label>
            </div>
            <div class="form-group col-lg-2">
                <label for="params_key">Key</label>
            </div>

            <div class="form-group col-lg-9">
                <label for="params_val">Value</label>
            </div>
        </div>

        <div id="params-first" class="params col-lg-12">
            <div class="form-group col-lg-1">
                <label class="toggleparam btn btn-success">
                    <span class="state">On</span>
                    <input type="hidden" id="params_enabled" name="params_enabled[]" class="form-control" value="on" />
                </label>
            </div>
            <div class="form-group col-lg-2">
                <input id="params_key" name="params_key[]" type="text" class="form-control" />
            </div>
            <div class="form-group col-lg-7">
                <input id="params_val" name="params_val[]" type="text" class="form-control" />
            </div>
            <div class="form-group col-lg-2">
                <button type="button" class="addparam btn btn-primary">Add</button>
                <button type="button" class="removeparam btn btn-danger">Remove</button>
            </div>
        </div>

        <div class="row col-lg-2">
            <button id="submitbutton" type="button" class="btn btn-primary">Query</button>
            <button id="savebutton" type="button" class="btn btn-success">Save</button>
        </div>
    </form>
    <div id="queryresultcontainer" class="row col-lg-12 panel panel-default">
        <p id="queryresult">
        </p>
    </div>
</div>


<div id="templates" class="col-lg-3">
    <h1>Templates</h1>
    <div id="templateslist" class="row">
    </div>

    <h2>Preview</h1>
    <div id="templatespreview" class="row table table-responsive">
        <table class="table">
        </table>

    </div>

    <div id="previewoptions" class="row">
        <button id="loadbutton" type="button" class="btn btn-default">Load</button>
        <button id="deletebutton" type="button" class="btn btn-default">Delete</button>
    </div>
</div>


