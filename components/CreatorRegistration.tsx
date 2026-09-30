"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const niches = [
  "Fashion",
  "Fitness",
  "Beauty",
  "Food",
  "Travel",
  "Technology",
  "Gaming",
  "Education",
  "Lifestyle",
  "Finance",
  "Photography",
  "Other",
];

export default function CreatorRegistration() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    niche: "",
    instagramUsername: "",
    bio: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStepOne = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.city ||
      !formData.country ||
      !formData.niche ||
      !formData.instagramUsername
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/creators/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to register creator."
        );
      }

      setStep(2);
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInstagramConnect = () => {
    /*
      Meta OAuth will be connected here next.

      For now, this is only a temporary success screen.
    */
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="registration-page">
        <section className="success-card">
          <div className="success-icon">
            <Check size={34} />
          </div>

          <h1>Registration Complete</h1>

          <p>
            Thank you, {formData.fullName}. Your creator registration
            has been submitted successfully.
          </p>

          <div className="success-details">
            <div>
              <span>Instagram</span>
              <strong>
                @{formData.instagramUsername}
              </strong>
            </div>

            <div>
              <span>Niche</span>
              <strong>{formData.niche}</strong>
            </div>

            <div>
              <span>Location</span>
              <strong>
                {formData.city}, {formData.country}
              </strong>
            </div>
          </div>

          <button
            className="secondary-button"
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setError("");
            }}
          >
            Register another creator
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="registration-page">
      <div className="registration-container">
        {/* LEFT PANEL */}
        <section className="hero-panel">
          <div className="hero-content">
            <div className="brand">
              <div className="brand-mark">
                <span>IA</span>
              </div>

              <span>Influencer Analytics</span>
            </div>

            <div className="hero-text">
              <p className="eyebrow">
                CREATOR REGISTRATION
              </p>

              <h1>
                Grow your influence
                <br />
                with better data.
              </h1>

              <p className="hero-description">
                Join our creator analytics platform and get your
                Instagram performance tracked with meaningful
                insights.
              </p>
            </div>

            <div className="benefits">
              <div className="benefit">
                <div className="benefit-icon">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <strong>Secure connection</strong>
                  <p>
                    Your account connection is handled securely.
                  </p>
                </div>
              </div>

              <div className="benefit">
                <div className="benefit-icon">
                  <UserRound size={20} />
                </div>

                <div>
                  <strong>Creator analytics</strong>
                  <p>
                    Track your audience and growth over time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-footer">
            <span>Creator Analytics Platform</span>
            <span>© 2026</span>
          </div>
        </section>

        {/* FORM PANEL */}
        <section className="form-panel">
          <div className="form-wrapper">
            {/* STEP INDICATOR */}
            <div className="steps">
              <div
                className={`step ${
                  step >= 1 ? "active" : ""
                }`}
              >
                <div className="step-number">
                  {step > 1 ? (
                    <Check size={15} />
                  ) : (
                    "1"
                  )}
                </div>

                <span>Basic information</span>
              </div>

              <div className="step-line" />

              <div
                className={`step ${
                  step >= 2 ? "active" : ""
                }`}
              >
                <div className="step-number">2</div>

                <span>Connect Instagram</span>
              </div>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <div className="form-heading">
                  <h2>Tell us about yourself</h2>

                  <p>
                    Enter your details to create your creator
                    profile.
                  </p>
                </div>

                <form onSubmit={handleStepOne}>
                  <div className="form-grid">
                    <div className="field full">
                      <label htmlFor="fullName">
                        Full Name
                      </label>

                      <input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) =>
                          updateField(
                            "fullName",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="email">
                        Email
                      </label>

                      <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          updateField(
                            "email",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="phone">
                        Phone
                      </label>

                      <input
                        id="phone"
                        type="tel"
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={(e) =>
                          updateField(
                            "phone",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="city">
                        City
                      </label>

                      <input
                        id="city"
                        type="text"
                        placeholder="Hyderabad"
                        value={formData.city}
                        onChange={(e) =>
                          updateField(
                            "city",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="country">
                        Country
                      </label>

                      <input
                        id="country"
                        type="text"
                        placeholder="India"
                        value={formData.country}
                        onChange={(e) =>
                          updateField(
                            "country",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="niche">
                        Content Niche
                      </label>

                      <select
                        id="niche"
                        value={formData.niche}
                        onChange={(e) =>
                          updateField(
                            "niche",
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="">
                          Select your niche
                        </option>

                        {niches.map((niche) => (
                          <option
                            key={niche}
                            value={niche}
                          >
                            {niche}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="field">
                      <label htmlFor="instagramUsername">
                        Instagram Username
                      </label>

                      <div className="input-with-prefix">
                        <span>@</span>

                        <input
                          id="instagramUsername"
                          type="text"
                          placeholder="yourusername"
                          value={
                            formData.instagramUsername
                          }
                          onChange={(e) =>
                            updateField(
                              "instagramUsername",
                              e.target.value.replace(
                                "@",
                                ""
                              )
                            )
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="field full">
                      <label htmlFor="bio">
                        Short Bio{" "}
                        <span>(Optional)</span>
                      </label>

                      <textarea
                        id="bio"
                        placeholder="Tell us a little about your content..."
                        rows={4}
                        value={formData.bio}
                        onChange={(e) =>
                          updateField(
                            "bio",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}

                  <button
                    className="primary-button"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      "Saving..."
                    ) : (
                      <>
                        Continue
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <div className="form-heading">
                  <h2>Connect your Instagram</h2>

                  <p>
                    Connect your professional Instagram
                    account to allow analytics tracking.
                  </p>
                </div>

                <div className="instagram-card">
                  <div className="instagram-logo">
                    <span>IG</span>
                  </div>

                  <div className="instagram-info">
                    <strong>
                      @{formData.instagramUsername}
                    </strong>

                    <span>
                      Instagram Professional Account
                    </span>
                  </div>
                </div>

                <div className="security-box">
                  <ShieldCheck size={22} />

                  <div>
                    <strong>
                      Your data is protected
                    </strong>

                    <p>
                      Your Instagram account will be
                      connected securely. We only request
                      the permissions required for
                      analytics.
                    </p>
                  </div>
                </div>

                <button
                  className="primary-button"
                  type="button"
                  onClick={handleInstagramConnect}
                >
                  Connect Instagram
                  <ArrowRight size={18} />
                </button>

                <button
                  className="back-button"
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError("");
                  }}
                >
                  ← Back to information
                </button>
              </>
            )}

            <div className="form-footer">
              <ShieldCheck size={15} />

              <span>
                Your information is kept secure and private.
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
