
import React, { useState, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/use-auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PenTool, Check, Clock, Shield, FileText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ElectronicSignatureProps {
  documentType: string;
  patientId: string;
  content: string;
  onSigned: (signature: SignatureData) => void;
}

export interface SignatureData {
  signedBy: string;
  signedAt: string;
  timestamp: string;
  documentHash: string;
  ipAddress: string;
  deviceInfo: string;
  documentType: string;
  patientId: string;
  content: string;
}

const ElectronicSignature: React.FC<ElectronicSignatureProps> = ({
  documentType,
  patientId,
  content,
  onSigned
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isSignatureMode, setIsSignatureMode] = useState(false);
  const [signatureText, setSignatureText] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate document hash (simulation)
  const generateDocumentHash = (content: string): string => {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0').toUpperCase();
  };

  // Get device information
  const getDeviceInfo = (): string => {
    return `${navigator.userAgent.split(' ')[0]} - ${window.screen.width}x${window.screen.height}`;
  };

  // Simulate IP address retrieval
  const getIPAddress = (): string => {
    return '192.168.1.' + Math.floor(Math.random() * 255);
  };

  const handleStartSignature = () => {
    if (!user) {
      toast({
        title: t('authenticationRequired'),
        description: t('pleaseLoginToSign'),
        variant: 'destructive'
      });
      return;
    }
    setIsSignatureMode(true);
  };

  const handleSign = async () => {
    if (!user) return;
    
    if (confirmText !== `${t('iConfirm')} ${user.name}`) {
      toast({
        title: t('confirmationRequired'),
        description: t('pleaseTypeConfirmationText'),
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate signature processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const signatureData: SignatureData = {
        signedBy: user.name,
        signedAt: new Date().toISOString(),
        timestamp: new Date().toLocaleString('fr-FR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        }),
        documentHash: generateDocumentHash(content),
        ipAddress: getIPAddress(),
        deviceInfo: getDeviceInfo(),
        documentType,
        patientId,
        content
      };

      onSigned(signatureData);

      toast({
        title: t('documentSigned'),
        description: t('documentSignedSuccessfully')
      });

      setIsSignatureMode(false);
      setSignatureText('');
      setConfirmText('');
    } catch (error) {
      console.error('Error signing document:', error);
      toast({
        title: t('signatureError'),
        description: t('errorSigningDocument'),
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isSignatureMode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            {t('electronicSignature')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>{t('secureElectronicSignature')}</span>
          </div>
          
          <div className="space-y-2">
            <Label>{t('documentType')}</Label>
            <Badge variant="outline">{documentType}</Badge>
          </div>

          <div className="space-y-2">
            <Label>{t('patientId')}</Label>
            <div className="text-sm font-mono bg-muted p-2 rounded">{patientId}</div>
          </div>

          <Button 
            onClick={handleStartSignature}
            className="w-full"
            disabled={!user}
          >
            <PenTool className="h-4 w-4 mr-2" />
            {t('proceedToSignature')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool className="h-5 w-5" />
          {t('signDocument')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informations de signature */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <Label className="text-xs text-muted-foreground">{t('signedBy')}</Label>
            <p className="font-medium">{user?.name}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">{t('timestamp')}</Label>
            <p className="font-mono text-xs">{new Date().toLocaleString('fr-FR')}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">{t('documentHash')}</Label>
            <p className="font-mono text-xs">{generateDocumentHash(content)}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">{t('ipAddress')}</Label>
            <p className="font-mono text-xs">{getIPAddress()}</p>
          </div>
        </div>

        {/* Zone de signature */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="signature">{t('digitalSignature')}</Label>
            <Textarea
              id="signature"
              placeholder={t('typeYourNameToSign')}
              value={signatureText}
              onChange={(e) => setSignatureText(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="confirm">
              {t('confirmationText')} - {t('typeConfirmationPhrase')}: 
              <span className="font-mono text-primary ml-1">
                "{t('iConfirm')} {user?.name}"
              </span>
            </Label>
            <Input
              id="confirm"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`${t('iConfirm')} ${user?.name}`}
              className="mt-1"
            />
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-2">
          <Button
            onClick={handleSign}
            disabled={isProcessing || !signatureText || confirmText !== `${t('iConfirm')} ${user?.name}`}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                {t('processing')}
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                {t('signDocument')}
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setIsSignatureMode(false)}
            disabled={isProcessing}
          >
            {t('cancel')}
          </Button>
        </div>

        {/* Avertissements légaux */}
        <div className="text-xs text-muted-foreground bg-muted p-3 rounded space-y-1">
          <p className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {t('signatureLegalWarning')}
          </p>
          <p>{t('gdprCompliant')}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElectronicSignature;
