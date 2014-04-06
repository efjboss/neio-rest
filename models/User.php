<?php 
/**
 * @author Erik Boss <erik@erikboss.nl>
 * @copyright Copyright (C) 2014 Erik Boss
 */

namespace neiorest\models;

use yii\base\Model;
use yii\web\IdentityInterface;

class Template extends Model implements IdentityInterface
{
    public $id;
    public $username;
    public $password;
    public $authKey;
    public $accessToken;

    private static $user = [
            'id' => '1',
            'username' => 'user',
            'password' => 'user',
            'authKey' => 'testkey',
            'accessToken' => 'testkey',
    ];

    /**
* @inheritdoc
*/
    public static function findIdentity($id)
    {
        return $user;
    }

    /**
* @inheritdoc
*/
    public static function findIdentityByAccessToken($token)
    {
        if ($user['accessToken'] === $token) {
            return new static($user);
        }

        return null;
    }

    /**
* Finds user by username
*
* @param string $username
* @return static|null
*/
    public static function findByUsername($username)
    {
        if (strcasecmp($user['username'], $username) === 0) {
            return new static($user);
        }

        return null;
    }

    /**
* @inheritdoc
*/
    public function getId()
    {
        return $this->id;
    }

    /**
* @inheritdoc
*/
    public function getAuthKey()
    {
        return $this->authKey;
    }

    /**
* @inheritdoc
*/
    public function validateAuthKey($authKey)
    {
        return $this->authKey === $authKey;
    }

    /**
* Validates password
*
* @param string $password password to validate
* @return boolean if password provided is valid for current user
*/
    public function validatePassword($password)
    {
        return $this->password === $password;
    }
}
