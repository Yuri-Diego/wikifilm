import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";

export default function ShareDialog({
    isOpen,
    onClose,
    shareUrl,
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent data-testid="dialog-share">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-primary" />
                        Compartilhar Lista
                    </DialogTitle>
                    <DialogDescription>
                        Compartilhe sua lista de favoritos com amigos através deste link
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            value={shareUrl}
                            readOnly
                            className="flex-1"
                            data-testid="input-share-url"
                        />
                        <Button
                            onClick={handleCopy}
                            variant={copied ? "default" : "outline"}
                            data-testid="button-copy-link"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Copiado!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copiar
                                </>
                            )}
                        </Button>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Qualquer pessoa com este link poderá visualizar sua lista de favoritos.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
