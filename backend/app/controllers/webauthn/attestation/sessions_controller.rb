class Webauthn::Attestation::SessionsController < ApplicationController
  def create
    if session[:webauthn_challenge].nil?
      return render json: { error: "No challenge found in session" }, status: :unprocessable_entity
    end

    webauthn_credential = WebAuthn::Credential.from_create(create_params)

    begin
      webauthn_credential.verify(session[:webauthn_challenge])

      user = User.find(session[:webauthn_user_id])

      user.webauthn_credentials.create!(
        webauthn_id: webauthn_credential.id,
        public_key: webauthn_credential.public_key,
        sign_count: webauthn_credential.sign_count
      )

      reset_session
      session[:user_id] = user.id
    rescue WebAuthn::VerificationError, WebAuthn::Error => e
      return render json: { error: e.message }, status: :unprocessable_entity
    end

    render json: { status: "ok" }
  end

  private

  def create_params
    params.require(:session).permit(
      :id, :rawId, :type, :authenticatorAttachment,
      clientExtensionResults: {},
      response: [:attestationObject, :clientDataJSON, { transports: [] }]
    )
  end
end
