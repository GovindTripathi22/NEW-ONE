import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import {
  Sprout,
  Landmark,
  TrendingUp,
  Stethoscope,
  CloudSun,
  ShieldCheck,
  Users,
  ArrowRight,
  Sparkles,
  PhoneCall,
} from 'lucide-react';

export default function LandingPage() {

  const navigate = useNavigate();

  const features = [
    {
      title: 'Government Scheme Finder',
      subtitle: 'Instant eligibility matching for PM-KISAN, PMFBY, Soil Health Card, and state subventions.',
      icon: Landmark,
      color: '#2E7D32',
      badge: 'Verified Schemes',
    },
    {
      title: 'AI Crop Advisory',
      subtitle: 'Real-time pest detection, soil health diagnostics, and localized crop management tips.',
      icon: Stethoscope,
      color: '#0288D1',
      badge: 'AI Powered',
    },
    {
      title: 'Live Mandi Prices',
      subtitle: 'Daily APMC market rates across Indian districts with historical price trends & recommendations.',
      icon: TrendingUp,
      color: '#F9A825',
      badge: 'Real-time APMC',
    },
    {
      title: 'Hyperlocal Weather',
      subtitle: '7-day precipitation forecasts, extreme event warnings, and crop activity timing alerts.',
      icon: CloudSun,
      color: '#E65100',
      badge: 'Forecast Alerts',
    },
  ];

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '32px' }}>
        {/* Hero Banner */}
        <section
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.7)), url('/assets/farm_hero.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 'var(--radius-lg)',
            padding: '56px 20px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                backgroundColor: 'var(--color-primary)',
                color: '#FFF',
                borderRadius: 'var(--radius-full)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                marginBottom: '16px',
              }}
            >
              <Sparkles size={14} /> Empowering Indian Farmers with Smart AI
            </div>

            <h1
              style={{
                fontSize: 'clamp(28px, 5vw, 44px)',
                fontWeight: 'var(--font-weight-bold)',
                color: '#FFFFFF',
                lineHeight: 1.2,
                marginBottom: '16px',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              Transform Your Farming with <span style={{ color: 'var(--color-accent-light)' }}>KrishiSahayak</span>
            </h1>

            <p
              style={{
                fontSize: 'var(--font-size-lg)',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '32px',
                maxWidth: '680px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Access instant government subsidy eligibility, AI-driven crop disease diagnostics, live Mandi price feeds, and personalized weather advisories — all in one simple portal.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate('/register')}
              >
                Register Profile & Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={PhoneCall}
                onClick={() => navigate('/login')}
              >
                Login with Phone / OTP
              </Button>
            </div>
          </div>
        </section>



        {/* Feature Cards Grid */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '8px' }}>
              Comprehensive Smart Farming Platform
            </h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Built specifically for Indian smallholders and commercial farmers to maximize crop yield and income.
            </p>
          </div>

          <div className="grid-2 gap-lg">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Card
                  key={idx}
                  hoverable
                  elevation="shadow-sm"
                  padding="lg"
                  onClick={() => navigate('/login')}
                  actions={
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--color-surface-variant)',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: feat.color,
                      }}
                    >
                      {feat.badge}
                    </span>
                  }
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: `${feat.color}15`,
                        color: feat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={26} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '6px' }}>{feat.title}</h3>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                        {feat.subtitle}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA Banner */}
        <section
          style={{
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '40px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <Sprout size={48} style={{ color: 'var(--color-accent)' }} />
          <h2 style={{ fontSize: 'var(--font-size-2xl)', color: '#FFF' }}>Ready to Boost Your Farm Productivity?</h2>
          <p style={{ color: 'var(--color-primary-light)', maxWidth: '600px', fontSize: 'var(--font-size-base)' }}>
            Join thousands of progressive farmers across India. Register your farmer profile in less than 2 minutes.
          </p>
          <Button variant="accent" size="lg" onClick={() => navigate('/register')}>
            Create Farmer Account
          </Button>
        </section>
      </div>
    </Layout>
  );
}
