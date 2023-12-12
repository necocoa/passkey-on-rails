class Webauthn::Attestation::RegistrationsController < ApplicationController
  def create
    user = User.new(create_params)

    unless user.update(webauthn_id: WebAuthn.generate_user_id)
      return render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end

    creation_options = WebAuthn::Credential.options_for_create(
      user: { id: user.webauthn_id, name: user.username },
      exclude: user.webauthn_credentials.pluck(:webauthn_id)
    )

    # Store the newly generated challenge somewhere so you can have it
    # for the verification phase.
    session[:webauthn_challenge] = creation_options.challenge
    session[:webauthn_user_id] = user.id

    # Send `creation_options` back to the browser, so that they can be used
    # to call `navigator.credentials.create({ "publicKey": creationOptions })`
    render json: creation_options
  end

  private

  def create_params
    params.require(:registration).permit(:username)
  end
end
