<?php

header('Content-Type: application/json');

class Response {

	public $sent;

	public $from;
	public $message;
	public $name;

	private $mailer;

	/**
	 * Response constructor.
	 * @param $get {array}
	 * @param $mailer {PHPMailer}
	 * @internal param bool $sent
	 */
	public function __construct($get, $mailer)
	{
		$this->mail = $get['from'];
		$this->message = $get['message'];
		$this->name = $get['name'];

		$this->mailer = $mailer;
	}

	/**
	 * @param mixed $sent
	 */
	public function setSent($sent)
	{
		$this->sent = $sent;
	}

	/**
	 * @return string
	 */
	public function toJSON()
	{
		return json_encode($this);
	}

}

require '../PHPMailer/PHPMailerAutoload.php';

// create new instance
$mailer = new PHPMailer;

// set charset
$mailer->CharSet = 'UTF-8';

//$mail->SMTPDebug = 3;

// set header
$mailer->isSMTP();
$mailer->Host = 'box729.bluehost.com';
$mailer->SMTPAuth = true;
$mailer->Username = 'mailman@letsmowe.com';
$mailer->Password = '64op3gZxONGO';
$mailer->SMTPSecure = 'ssl';
$mailer->Port = 465;

// set from, to and carbon copy (hidden)
$mailer->setFrom('mailman@letsmowe.com', 'La Lolla - MailMan');
$mailer->addAddress($_GET['mail'], $_GET['name']);
$mailer->addBCC('joseeduardobarros@gmail.com', 'Eduardo Barros');

// set type, subject and body
$mailer->isHTML(true);
$mailer->Subject = 'Requisição de contato - La Lolla';
$mailer->Body = $_GET['message'];
$mailer->AltBody = $_GET['message'];

// create new instance of response
$response = new Response($_GET, $mailer);

// send
if(!$mailer->send()) {
	$response->setSent(false);
} else {
	$response->setSent(true);
}

// print response JSON
print_r($response->toJSON());

?>