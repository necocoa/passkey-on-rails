class Webauthn::Assertion::SessionsController < ApplicationController
  def create
    webauthn_credential = WebAuthn::Credential.from_get(create_params)
    stored_credential = WebauthnCredential.find_by!(webauthn_id: webauthn_credential.id)

    begin
      webauthn_credential.verify(
        session[:webauthn_challenge],
        public_key: stored_credential.public_key,
        sign_count: stored_credential.sign_count
      )

      stored_credential.update!(sign_count: webauthn_credential.sign_count)

      reset_session
      session[:user_id] = stored_credential.user.id
    rescue WebAuthn::SignCountVerificationError, WebAuthn::Error => e
      # Cryptographic verification of the authenticator data succeeded, but the signature counter was less then or equal
      # to the stored value. This can have several reasons and depending on your risk tolerance you can choose to fail or
      # pass authentication. For more information see https://www.w3.org/TR/webauthn/#sign-counter
      return render json: { error: e.message }, status: :unprocessable_entity
    end

    render json: { status: "ok" }
  end

  private

  def create_params
    params.require(:session).permit(
      :id, :rawId, :type, :authenticatorAttachment,
      clientExtensionResults: {},
      response: [:clientDataJSON, :authenticatorData, :signature, :userHandle]
    )
  end
end
