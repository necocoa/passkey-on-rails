class Webauthn::Assertion::OptionsController < ApplicationController
  def create
    options = WebAuthn::Credential.options_for_get
    session[:webauthn_challenge] = options.challenge
    render json: options
  end
end
