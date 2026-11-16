<?php
// Upload as site-config.php next to send-email.php, outside the repo and dist/. Never commit real values.
return [
  'smtp_host'        => 'smtp.office365.com',       // not a secret
  'smtp_port'        => 587,                   // not a secret
  'smtp_user'        => 'presidenta@fespan.org',
  'smtp_pass'        => 'CHANGE-ME',
  'fallback_email'   => 'presidenta@fespan.org',   // used when form-config.json has no recipients
  'turnstile_secret' => '',                    // Cloudflare Turnstile secret key; empty = captcha off
];
