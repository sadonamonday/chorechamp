<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../config/Database.php';
include_once '../models/User.php';

// Instantiate DB & connect
$database = new Database();
$db = $database->connect();

// Instantiate user object
$user = new User($db);

// Get raw posted data
$data = json_decode(file_get_contents("php://input"));

// Check if required data is provided
if(!isset($data->email) || !isset($data->provider) || !isset($data->provider_id)) {
    echo json_encode(
        array(
            'status' => 'error',
            'message' => 'Missing required fields'
        )
    );
    exit();
}

// Set user properties
$user->email = $data->email;
$user->username = isset($data->name) ? $data->name : explode('@', $data->email)[0];
$user->provider = $data->provider;
$user->provider_id = $data->provider_id;
$user->role = 'tasker'; // Default role for OAuth users

// Check if user exists with this provider and provider_id
$result = $user->findByProviderAndProviderId();

if($result && $result->rowCount() > 0) {
    // User exists, log them in
    $row = $result->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode(
        array(
            'status' => 'success',
            'user' => array(
                'id' => $row['id'],
                'username' => $row['username'],
                'email' => $row['email'],
                'role' => $row['role'],
                'provider' => $row['provider']
            )
        )
    );
} else {
    // Check if user exists with this email
    $result = $user->findByEmail();
    
    if($result && $result->rowCount() > 0) {
        // User exists with this email, update their provider info
        $row = $result->fetch(PDO::FETCH_ASSOC);
        $user->id = $row['id'];
        
        if($user->updateProviderInfo()) {
            echo json_encode(
                array(
                    'status' => 'success',
                    'user' => array(
                        'id' => $row['id'],
                        'username' => $row['username'],
                        'email' => $row['email'],
                        'role' => $row['role'],
                        'provider' => $data->provider
                    )
                )
            );
        } else {
            echo json_encode(
                array(
                    'status' => 'error',
                    'message' => 'Failed to update user provider information'
                )
            );
        }
    } else {
        // User doesn't exist, create a new one
        if($user->createWithOAuth()) {
            echo json_encode(
                array(
                    'status' => 'success',
                    'user' => array(
                        'id' => $user->id,
                        'username' => $user->username,
                        'email' => $user->email,
                        'role' => $user->role,
                        'provider' => $user->provider
                    )
                )
            );
        } else {
            echo json_encode(
                array(
                    'status' => 'error',
                    'message' => 'Failed to create user'
                )
            );
        }
    }
}