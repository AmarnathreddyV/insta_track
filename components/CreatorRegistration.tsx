"use client";

import { FormEvent, useEffect, useState } from "react";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  niche: string;
  instagramUsername: string;
  bio: string;
};

type Creator = {
  id: number;
  name: string;
  email: string;
  instagram_username: string;
  status: string;
  created_at: string;
};

export default function CreatorRegistration() {
  const [step, setStep] = useState(1);
  const [creatorId, setCreatorId] = useState<number | null>(null);
  const [creator, setCreator] = useState<Creator | null>(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    country: "India",
    niche: "Technology",
    instagramUsername: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");
  const [metaSuccess, setMetaSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const meta = params.get("meta");
    const returnedCreatorId = params.get("creatorId");

    if (returnedCreatorId) {
      setCreatorId(Number(returnedCreatorId));
    }

    if (meta === "success") {
      setMetaSuccess(true);
      setStep(3);

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }

    if (meta === "error") {
      const message =
        params.get("message") ||
        "Instagram connection failed.";

      setError(message);
      setStep(2);

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }
  }, []);

  const updateField = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleRegistration = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/creators/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to register creator."
        );
      }

      const registeredCreator =
        data.creator as Creator;

      setCreator(registeredCreator);
      setCreatorId(registeredCreator.id);
      setStep(2);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to register creator."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInstagramConnect = () => {
    if (!creatorId) {
      setError(
        "Creator registration is incomplete. Please go back and register again."
      );
      return;
    }

    setError("");
    setConnecting(true);

    window.location.href =
      `/api/auth/meta?creatorId=${encodeURIComponent(
        creatorId
      )}`;
  };

  const handleBack = () => {
    setError("");
    setStep(1);
  };

  const handleNewRegistration = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      city: "",
      country: "India",
      niche: "Technology",
      instagramUsername: "",
      bio: "",
    });

    setCreator(null);
    setCreatorId(null);
    setMetaSuccess(false);
    setError("");
    setStep(1);
  };

  return (
    <main className="registration-page">
      <section className="registration-container">
        <div className="hero-panel">
          <div className="hero-content">
            <div className="brand-badge">
              INFLUENCER ANALYTICS
            </div>

            <h1>
              Turn your Instagram
              <br />
              presence into insights.
            </h1>

            <p>
              Register your creator profile and connect
              your Instagram Professional account to start
              tracking performance.
            </p>

            <div className="hero-points">
              <div className="hero-point">
                <span>✓</span>
                Daily follower tracking
              </div>

              <div className="hero-point">
                <span>✓</span>
                Instagram performance analytics
              </div>

              <div className="hero-point">
                <span>✓</span>
                Growth insights
              </div>

              <div className="hero-point">
                <span>✓</span>
                AI-powered analysis
              </div>
            </div>
          </div>
        </div>

        <div className="form-panel">
          <div className="form-card">
            {step !== 3 && (
              <div className="progress-section">
                <div className="progress-header">
                  <span>
                    Step {step} of 2
                  </span>

                  <span>
                    {step === 1
                      ? "Basic information"
                      : "Instagram connection"}
                  </span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width:
                        step === 1 ? "50%" : "100%",
                    }}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="error-message">
                <strong>Something went wrong</strong>
                <span>{error}</span>
              </div>
            )}

            {step === 1 && (
              <>
                <div className="form-heading">
                  <span className="step-label">
                    STEP 1
                  </span>

                  <h2>Creator information</h2>

                  <p>
                    Tell us a little about yourself and
                    your Instagram profile.
                  </p>
                </div>

                <form
                  onSubmit={handleRegistration}
                  className="registration-form"
                >
                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="fullName">
                        Full Name
                        <span>*</span>
                      </label>

                      <input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(event) =>
                          updateField(
                            "fullName",
                            event.target.value
                          )
                        }
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="email">
                        Email
                        <span>*</span>
                      </label>

                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(event) =>
                          updateField(
                            "email",
                            event.target.value
                          )
                        }
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="phone">
                        Phone
                        <span>*</span>
                      </label>

                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(event) =>
                          updateField(
                            "phone",
                            event.target.value
                          )
                        }
                        placeholder="+91 XXXXX XXXXX"
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="city">
                        City
                        <span>*</span>
                      </label>

                      <input
                        id="city"
                        type="text"
                        value={formData.city}
                        onChange={(event) =>
                          updateField(
                            "city",
                            event.target.value
                          )
                        }
                        placeholder="Hyderabad"
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="country">
                        Country
                        <span>*</span>
                      </label>

                      <input
                        id="country"
                        type="text"
                        value={formData.country}
                        onChange={(event) =>
                          updateField(
                            "country",
                            event.target.value
                          )
                        }
                        placeholder="India"
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="niche">
                        Primary Niche
                        <span>*</span>
                      </label>

                      <select
                        id="niche"
                        value={formData.niche}
                        onChange={(event) =>
                          updateField(
                            "niche",
                            event.target.value
                          )
                        }
                        required
                      >
                        <option value="Fashion">
                          Fashion
                        </option>
                        <option value="Fitness">
                          Fitness
                        </option>
                        <option value="Beauty">
                          Beauty
                        </option>
                        <option value="Food">
                          Food
                        </option>
                        <option value="Travel">
                          Travel
                        </option>
                        <option value="Technology">
                          Technology
                        </option>
                        <option value="Gaming">
                          Gaming
                        </option>
                        <option value="Education">
                          Education
                        </option>
                        <option value="Lifestyle">
                          Lifestyle
                        </option>
                        <option value="Other">
                          Other
                        </option>
                      </select>
                    </div>

                    <div className="form-field full-width">
                      <label htmlFor="instagramUsername">
                        Instagram Username
                        <span>*</span>
                      </label>

                      <div className="input-prefix">
                        <span>@</span>

                        <input
                          id="instagramUsername"
                          type="text"
                          value={
                            formData.instagramUsername
                          }
                          onChange={(event) =>
                            updateField(
                              "instagramUsername",
                              event.target.value.replace(
                                /^@/,
                                ""
                              )
                            )
                          }
                          placeholder="your_username"
                          required
                        />
                      </div>

                      <small>
                        Enter your Instagram Professional
                        account username.
                      </small>
                    </div>

                    <div className="form-field full-width">
                      <label htmlFor="bio">
                        Short Bio
                      </label>

                      <textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(event) =>
                          updateField(
                            "bio",
                            event.target.value
                          )
                        }
                        placeholder="Tell us about your content..."
                        rows={4}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={loading}
                  >
                    {loading
                      ? "Registering..."
                      : "Continue to Instagram →"}
                  </button>
                </form>
              </>
            )}

            {step === 2 && (
              <>
                <div className="form-heading">
                  <span className="step-label">
                    STEP 2
                  </span>

                  <h2>Connect Instagram</h2>

                  <p>
                    Connect your Instagram Professional
                    account through Meta to enable
                    analytics.
                  </p>
                </div>

                {creator && (
                  <div className="creator-summary">
                    <div className="creator-avatar">
                      {creator.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>{creator.name}</strong>

                      <span>
                        @{creator.instagram_username}
                      </span>
                    </div>
                  </div>
                )}

                <div className="instagram-connect-card">
                  <div className="instagram-icon">
                    ◎
                  </div>

                  <div className="connect-content">
                    <h3>
                      Connect with Instagram
                    </h3>

                    <p>
                      You will be redirected to Meta to
                      securely authorize access to your
                      Instagram Professional account.
                    </p>

                    <div className="connect-features">
                      <span>✓ Profile data</span>
                      <span>✓ Follower insights</span>
                      <span>✓ Performance data</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="primary-button instagram-button"
                  onClick={handleInstagramConnect}
                  disabled={
                    connecting || !creatorId
                  }
                >
                  {connecting
                    ? "Opening Meta..."
                    : "Connect Instagram with Meta"}
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleBack}
                  disabled={connecting}
                >
                  ← Back to Basic Information
                </button>

                <p className="security-note">
                  🔒 Your Meta credentials are handled
                  securely by Meta. We never ask for your
                  Instagram password.
                </p>
              </>
            )}

            {step === 3 && metaSuccess && (
              <>
                <div className="success-card">
                  <div className="success-icon">
                    ✓
                  </div>

                  <span className="step-label">
                    REGISTRATION COMPLETE
                  </span>

                  <h2>
                    Instagram connected successfully!
                  </h2>

                  <p>
                    Your creator profile has been
                    registered and your Instagram account
                    is now connected to the analytics
                    platform.
                  </p>

                  <div className="success-details">
                    <div>
                      <span>Creator</span>
                      <strong>
                        {creator?.name ||
                          formData.fullName}
                      </strong>
                    </div>

                    <div>
                      <span>Instagram</span>
                      <strong>
                        @{formData.instagramUsername}
                      </strong>
                    </div>

                    <div>
                      <span>Status</span>
                      <strong className="status-active">
                        Connected
                      </strong>
                    </div>
                  </div>

                  <div className="success-message">
                    Your Instagram data can now be
                    tracked through the analytics system.
                  </div>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={handleNewRegistration}
                  >
                    Register Another Creator
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
