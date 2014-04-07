<?php
/**
 * @author Erik Boss <erik@erikboss.nl>
 * @copyright Copyright (C) 2014 Erik Boss
 */

namespace neiorest\controllers;

use yii;
use yii\web\Controller;
use yii\web\Response;
use neiorest\models\Template;

class SiteController extends Controller {
    public function actionIndex()
    {
        return $this->render('index');
    }

    public function actionSave()
    {
        try {
        if (array_key_exists('name', $_REQUEST)) {
            $template = Template::find(['name' => $_REQUEST['name']]);
            if (!$template) {
                $template = new Template();
                $template->name = $_REQUEST['name'];
            }
            $data = $_REQUEST;
            $template->data = json_encode($data);
            if ($template->save() !== false) {
                return new Response(['format' => Response::FORMAT_JSON, 'data' => ['status' => 'success', 'message' => 'Template saved succesfully']]);
            } else {
                Yii::trace('Could not save template');
            }
        }
        } catch(\Exception $e) {
            Yii::trace($e->getMessage());
        }
        return new Response(['format' => Response::FORMAT_JSON, 'data' => ['status' => 'error', 'message' => 'Could not save template']]);
    }

    public function actionTemplates()
    {
        $models = Template::find()->all();
        $templates = [];
        foreach($models as $template) {
            $templates[$template->name] = json_decode($template->data);
        }

        return new Response(['format' => Response::FORMAT_JSON, 'data' => $templates]);
    }

    public function actionTemplate()
    {
        $model = Template::find(['name' => $_REQUEST['name']]);
        if ($model) {
            return new Response(['format' => Response::FORMAT_JSON, 'data' => json_decode($model->data)]);
        }
        return null;
    }

    public function actionDelete()
    {
        $model = Template::find(['name' => $_POST['name']]);
        if ($model and $model->delete() !== false) {
            return new Response(['format' => Response::FORMAT_JSON, 'data' => ['status' => 'success', 'message' => 'Template successfully deleted']]);
        }
        return new Response(['format' => Response::FORMAT_JSON, 'data' => ['status' => 'error', 'message' => 'Could not delete template']]);
    }

    public function actionQuery()
    {

        if (isset($_POST)) {
            $data = $_POST;

            $url = $data['apiurl'];
            $method = $data['method'];
            unset($data['apiurl']);
            unset($data['method']);
            unset($data['params_enabled']);

            $postdata = [];
            for ($i = 0; $i < count($data['params_key']); $i++) {
                $postdata[$data['params_key'][$i]] = $data['params_val'][$i];
            }

            $ch = curl_init();

            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            //curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
            //curl_setopt($ch, CURLOPT_AUTOREFERER, 1);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
            curl_setopt($ch, CURLOPT_TIMEOUT, 5);


            if ($method === 'POST') {
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $postdata);
            }

            $res = curl_exec($ch);
            $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            curl_close($ch);

            return new Response(['format' => Response::FORMAT_JSON, 'data' => ['status' => 'success', 'data' => ['result' => $res, 'status' => $status]]]);
        }
        return new Response(['format' => Response::FORMAT_JSON, 'data' => ['status' => 'error', 'message' => 'No query parameters found']]);
    }
}
